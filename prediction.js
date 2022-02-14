import axios from 'axios';
import * as danfo from 'danfojs-node';
import * as tensorflow from '@tensorflow/tfjs-node';

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export async function loadData(scale = true, lookUpStep = 15, stepsCount = 50, splitByDate = true, shuffle = true, testSize = 0.2) {
    let closeColumn = "close"
    let result = {}
    let data = await requestData('MVZ.A-VS');
    let dataFrame = createDataFrame(data);
    result["dataframe"] = dataFrame.copy();
    // Escalar valores entre 0 y 1
    if (scale) {
        let columnScaler = {};
        let scaler = new danfo.MinMaxScaler();
        let expandedDims = danfo.tensorflow.expandDims(dataFrame[closeColumn].values, 1);
        dataFrame[closeColumn] = scaler.fitTransform(expandedDims.arraySync());
        columnScaler[closeColumn] = scaler;
        result["columnScaler"] = columnScaler;
    }
    let array = dataFrame[closeColumn].values;
    // Agregar NaN a columna de los valores futuros
    for(let index = 0; index < lookUpStep; index++) {
        array.shift();
        array.push(NaN);
    }
    dataFrame.addColumn("future", array, { inplace: true });
    let lastSequence = dataFrame[closeColumn].tail(lookUpStep).values;
    dataFrame.dropNa({ axis: 1, inplace: true });
    dataFrame.print();

    // Zip
    let sequenceData = [];
    let sequences = [];
    let zippedDates = zip(dataFrame["close"].values, dataFrame["date"].values);
    let zippedFutureValues = zip(zippedDates, dataFrame.future.values);
    // Sequences tiene los ultimos 50 valores y sequenceData guarda los 50 valores anteriores al valor futuro y el valor futuro
    for (let index = 0; index < zippedFutureValues.length; index++) {
        let entry = zippedFutureValues[index][0];
        let target = zippedFutureValues[index][1];
        sequences.push(entry);
        if (sequences.length === stepsCount) {
            sequenceData.push([sequences, target]);
            if (index < zippedFutureValues.length - 1) {
                sequences.shift();
            }
        }
    }

    lastSequence = sequences.map((item) => item[0]).concat(lastSequence);
    // TODO; Ver si esto sirve
    result["lastSequence"] = lastSequence.map((item) => [item]);

    let x = [];
    let y = [];

    for (let index = 0; index < sequenceData.length; index++) {
        let sequence = sequenceData[index][0];
        let target = sequenceData[index][1];
        x.push(sequence);
        y.push(target);
    }

    if (splitByDate) {
        let trainSample = parseInt((1 - testSize) * x.length);
        result["x_train"] = x.slice(0, trainSample);
        result["y_train"] = y.slice(0, trainSample);
        result["x_test"] = x.slice(trainSample, x.length);
        result["y_test"] = y.slice(trainSample, x.length);

        if (shuffle) {
            let trainShuffle = shuffleInUnison(result["x_train"], result["y_train"]);
            let testShuffle = shuffleInUnison(result["x_test"], result["y_test"]);
            result["x_train"] = trainShuffle[0];
            result["y_train"] = trainShuffle[1];
            result["x_test"] = testShuffle[0];
            result["y_test"] = testShuffle[1];
        }
    } else {
        // TODO: Prodemos usar https://github.com/javascriptdata/scikit.js
    }

    let dates = result["x_test"].map((array) => array[array.length - 1][1]);
    result["test_dataframe"] = result["dataframe"].loc(dates);
    // TODO: Quitar fechas repetidas (test_dataframe.index)
    // result["x_train"] = result["x_train"].map((array) => array.map(innerArray => [innerArray[0]]));
    // result["x_test"] = result["x_test"].map((array) => array.map(innerArray => [innerArray[0]]));
    return result
}

async function requestData(title) {
    console.info('Requesting data');
    let url = `https://sandbox.iexapis.com/stable/stock/${title}/chart/max?token=Tpk_7ef63a0d0ca94395a15d73c3fd314f0e`;
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

function shuffleInUnison(array1, array2) {
    let currentIndex = array1.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array1[currentIndex], array1[randomIndex]] = [
            array1[randomIndex], array1[currentIndex]];
        [array2[currentIndex], array2[randomIndex]] = [
            array2[randomIndex], array2[currentIndex]];
    }

    return [array1, array2];
}


export function createModel(sequenceLength, featuresCount, units = 256, layers = 2, bidirectional = false,
                     dropout = 0.3, loss= "meanSquaredError", optimizer = "rmsprop") {
    let model = tensorflow.sequential();
    for (let index = 0; index < layers; index++) {
        console.log(index);
        let cell;
        if (index === 0) {
            cell = tensorflow.layers.lstm({ units, returnSequences: true, batchInputShape: [null, sequenceLength, featuresCount] });
        } else if (index === layers -1) {
            cell = tensorflow.layers.lstm({ units, returnSequences: false });
        } else {
            cell = tensorflow.layers.lstm({ units, returnSequences: true });
        }
        if (bidirectional) {
            model.add(tensorflow.layers.bidirectional({ layer: cell }));
        } else {
            model.add(cell);
        }
        model.add(tensorflow.layers.dropout({ rate: 0.3 }));
    }
    model.add(tensorflow.layers.dense({ units: 1, activation: "linear" }))
    model.compile({
        loss,
        metrics: ["accuracy"],
        optimizer
    });
    return model;
}
