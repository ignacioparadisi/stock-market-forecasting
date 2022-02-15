import axios from 'axios';
import * as danfo from 'danfojs-node';
import * as tensorflow from '@tensorflow/tfjs-node';
import csvtojson from 'csvtojson';
import { trainTestSplit } from "./trainTestSplit.js";

/**
 * Combines the elements of two arrays into one array with multiples arraies inside.
 * Both arrays should have the same length
 * @param a first array
 * @param b second array
 * @returns {*}
 */
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

/**
 * Shuffles two arrays in the same order
 * @param array1
 * @param array2
 * @returns {*}
 */
function shuffleInUnison(array1, array2) {
    let currentIndex = array1.length,  randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array1[currentIndex], array1[randomIndex]] = [
            array1[randomIndex], array1[currentIndex]];
        [array2[currentIndex], array2[randomIndex]] = [
            array2[randomIndex], array2[currentIndex]];
    }
    return {
        array1,
        array2
    };
}

/**
 * Request data to stocks API
 * @param symbol Symbol of the title to be fetched
 * @returns {Promise<*>} an array with the historical stock values of the title
 */
async function requestData(symbol) {
    console.info('Requesting data');
    let url = `https://sandbox.iexapis.com/stable/stock/${symbol}-VS/chart/max?token=Tpk_7ef63a0d0ca94395a15d73c3fd314f0e`;
    let response = await axios.get(url)
    let data = response.data;
    return data.map((value) => {
        return {
            date: value.date,
            close: value.close,
            future: undefined
        }
    });
}

/**
 * Read a CSV file and converts it to JSON for the specified symbol
 * @param symbol Symbol to be read
 * @returns {Promise<any[]>}
 */
async function readData(symbol) {
    let filePath = `./Historico/${symbol}.csv`
    console.info(`Reading data from file ${filePath}`);
    try {
        return await csvtojson().fromFile(filePath);
    } catch(error) {
        console.error(error);
    }
}

/**
 * Creates a Danfo DataFrame from the stock values.
 * @param data JSON with stock values
 * @returns {DataFrame} DataFrame
 */
function createDataFrame(data) {
    for(let index = 0; index < data.length; index++) {
        let obj = data[index];
        let date = new Date(obj.date);
        let price = obj.close;
        if (date < new Date('2021-10-01')) {
            price /= 1000000;
        }
        if (date < new Date('2018-08-20')) {
            price /= 100000;
        }
        data[index].close = price;
    }
    let dataFrame = new danfo.DataFrame(data);
    dataFrame.setIndex({
        column: "date",
        inplace: true
    });
    return dataFrame;
}

function scaleDataFrame(dataFrame) {
    let columnScaler = {};
    let scaler = new danfo.MinMaxScaler();
    let expandedDims = danfo.tensorflow.expandDims(dataFrame["close"].values, 1);
    dataFrame["close"] = scaler.fitTransform(expandedDims.arraySync());
    columnScaler["close"] = scaler;
    return columnScaler
}

function createFutureColumn(dataFrame, lookUpStep) {
    let array = dataFrame["close"].values;
    // Agregar NaN a columna de los valores futuros
    for(let index = 0; index < lookUpStep; index++) {
        array.shift();
        array.push(NaN);
    }
    dataFrame.addColumn("future", array, { inplace: true });
}

function createSequences(dataFrame, stepsCount) {
    let sequenceData = [];
    let sequences = [];
    let zippedDates = zip(dataFrame["close"].values, dataFrame["date"].values);
    let zippedFutureValues = zip(zippedDates, dataFrame.future.values);
    // Sequences tiene los ultimos 50 valores y sequenceData guarda los 50 valores anteriores al valor futuro y el valor futuro
    for (let index = 0; index < zippedFutureValues.length; index++) {
        let entry = zippedFutureValues[index][0] // Close value and date inside an array
        let target = zippedFutureValues[index][1]; // future value
        sequences.push(entry);
        if (sequences.length === stepsCount) {
            let data = [...sequences]; // Make a clone of the array
            sequenceData.push([data, target]);
            if (index < zippedFutureValues.length - 1) {
                sequences.shift();
            }
        }
    }
    return {
        sequences,
        sequenceData
    }
}

function createPoints(sequenceData) {
    let x = [];
    let y = [];

    for (let index = 0; index < sequenceData.length; index++) {
        let sequence = sequenceData[index][0];
        let target = sequenceData[index][1];
        x.push(sequence);
        y.push(target);
    }
    return {
        x,
        y
    }
}

function splitDataByDate(points, testSize, result) {
    let trainSample = Math.round((1 - testSize) * points.x.length);
    result["x_train"] = points.x.slice(0, trainSample);
    result["y_train"] = points.y.slice(0, trainSample);
    result["x_test"] = points.x.slice(trainSample, points.x.length);
    result["y_test"] = points.y.slice(trainSample, points.x.length);
    return result;
}

function shuffleData(result) {
    let trainShuffle = shuffleInUnison(result["x_train"], result["y_train"]);
    let testShuffle = shuffleInUnison(result["x_test"], result["y_test"]);
    result["x_train"] = trainShuffle.array1;
    result["y_train"] = trainShuffle.array2;
    result["x_test"] = testShuffle.array1;
    result["y_test"] = testShuffle.array2;
    return result
}

export async function loadData(symbol, scale = true, lookUpStep = 15, stepsCount = 50, splitByDate = true, shuffle = true, testSize = 0.2) {
    let result = {}
    let data = await readData(symbol);
    let dataFrame = createDataFrame(data);
    console.log('======================= First DataFrame =======================');
    dataFrame.print();
    result["dataframe"] = dataFrame.copy();
    // Escalar valores entre 0 y 1
    if (scale) {
        result["columnScaler"] = scaleDataFrame(dataFrame);
        console.log('======================= Scaled DataFrame =======================');
        dataFrame.print();
    }
    createFutureColumn(dataFrame, lookUpStep);
    console.log('======================= Future Column DataFrame =======================');
    dataFrame.print();
    let lastSequence = dataFrame[["close"]].tail(lookUpStep).values.map((value) => [value]);
    console.log('======================= Last Sequence 1 =======================');
    console.info(lastSequence);
    dataFrame.dropNa({ axis: 1, inplace: true });
    console.log('======================= Drop NaN =======================');
    dataFrame.print();
    // Zip
    let sequence = createSequences(dataFrame, stepsCount);
    let sequences = sequence.sequences;
    let sequenceData = sequence.sequenceData;
    lastSequence = sequences.map((item) => [item[0]]).concat(lastSequence);
    // TODO: Ver si esto sirve
    result["lastSequence"] = lastSequence
    console.log('======================= Sequences =======================');
    console.info(sequences);
    console.log('======================= Sequence Data =======================');
    console.info(sequenceData);
    console.log('======================= Last Sequence 2 =======================');
    console.info(lastSequence);
    let points = createPoints(sequenceData);
    if (splitByDate) {
        result = splitDataByDate(points, testSize, result);
        if (shuffle) {
            result = shuffleData(result);
        }
    } else {
        let [XTrain, XTest, yTrain, yTest] = trainTestSplit(points.x, points.y, testSize, undefined, shuffle ? 0.3 : undefined);
        result.x_train = XTrain;
        result.y_train = yTrain;
        result.x_test = XTest;
        result.y_test = yTest;
    }

    let dates = result.x_test.map((array) => array[array.length - 1][1]);
    console.log('======================= Test Dates =======================');
    console.info(dates);
    result["test_dataframe"] = result["dataframe"].loc(dates);
    console.log('======================= Test DataFrame =======================');
    result["test_dataframe"].print()
    // TODO: Quitar fechas repetidas (test_dataframe.index)
    let xTrain = result["x_train"].map((array) => array.map(innerArray => [parseFloat(innerArray[0])]));
    result["x_train"] = tensorflow.tensor3d(xTrain, [xTrain.length, xTrain[0].length, xTrain[0][0].length]);
    console.log('======================= X Train =======================');
    console.info(result["x_train"]);
    let xTest = result["x_test"].map((array) => array.map(innerArray => [parseFloat(innerArray[0])]));
    result["x_test"] =  tensorflow.tensor3d(xTest, [xTest.length, xTest[0].length, xTest[0][0].length]);
    console.log('======================= X Test =======================');
    console.info(result["x_test"]);
    let yTrain = result["y_train"].map((value) => parseFloat(value));
    result["y_train"] =  tensorflow.tensor2d(yTrain, [yTrain.length, 1]);
    let yTest = result["y_test"].map((value) => parseFloat(value));
    result["y_test"] =  tensorflow.tensor2d(yTest, [yTest.length, 1]);
    return result
}

export function createModel(sequenceLength, featuresCount, units = 256, layers = 2, bidirectional = false,
                     dropout = 0.3, loss= "meanSquaredError", optimizer = "rmsprop") {
    let model = tensorflow.sequential();
    for (let index = 0; index < layers; index++) {
        let cell;
        if (index === 0) {
            console.info('Add first layer');
            cell = tensorflow.layers.lstm({ units, returnSequences: true, batchInputShape: [null, sequenceLength, featuresCount] });
        } else if (index === layers -1) {
            console.info('Add last layer');
            cell = tensorflow.layers.lstm({ units, returnSequences: false });
        } else {
            console.info(`Add layer ${index}`);
            cell = tensorflow.layers.lstm({ units, returnSequences: true });
        }
        if (bidirectional) {
            model.add(tensorflow.layers.bidirectional({ layer: cell }));
        } else {
            model.add(cell);
        }
        console.info('Add dropout layer');
        model.add(tensorflow.layers.dropout({ rate: 0.3 }));
    }
    console.info('Add dense layer');
    model.add(tensorflow.layers.dense({ units: 1, activation: "linear" }));
    console.info('Compiling model')
    model.compile({
        loss,
        metrics: ["accuracy"],
        optimizer
    });
    console.info('Model compiled successfully');
    return model;
}
