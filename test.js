import * as tensorflow from "@tensorflow/tfjs-node";
import {loadData} from "./prediction.js";
import * as math from 'mathjs';
import DataFrame from "danfojs-node/dist/danfojs-base/core/frame.js";
import Series from "danfojs-node/dist/danfojs-base/core/series.js";
import {expandDims} from "@tensorflow/tfjs-node";
import plotlyLib from 'plotly'
const plotly = plotlyLib('irparadisi.16', 'j8Z1ZlaOADjyBIZkuema');

let symbol = 'MVZ.A';
let path = `file://${process.cwd()}/models/model-${symbol.replace('.', '_')}`;
let stepsCount = 50;
let lookUpStep = 15
let scale = true;

let data = await loadData(symbol, true, 15, 50, false, true, 0.2);
let model = await tensorflow.loadLayersModel(`${path}/model.json`);
model.compile({
    loss: "meanSquaredError",
    metrics: ["accuracy"],
    optimizer: "rmsprop"
});


function predict() {
    let lastSequence = data.lastSequence.map((value) => value.map((number) => parseFloat(number)));
    lastSequence = lastSequence.slice(data.lastSequence.length - stepsCount, data.lastSequence.length);
    lastSequence = tensorflow.expandDims(lastSequence, 0)
    let prediction = model.predict(lastSequence);
    let predictedPrice;
    if (scale) {
        predictedPrice = data.columnScaler.close.inverseTransform(prediction).arraySync()[0][0];
    } else {
        predictedPrice = prediction.arraySync()[0][0]
    }
    return predictedPrice
}

function getFinalDataFrame() {
    let xTest = data.x_test;
    let yTest = data.y_test;
    let yPrediction = model.predict(xTest);
    if (scale) {
        yTest = math.squeeze(data.columnScaler.close.inverseTransform(expandDims(yTest, 0)).arraySync());
        yPrediction = math.squeeze(data.columnScaler.close.inverseTransform(yPrediction).arraySync());
    }
    let testDataFrame = data.test_dataframe;
    console.log(testDataFrame["close"].values.length);
    testDataFrame.addColumn(`adjustClose${lookUpStep}`, yTest, { inplace: true });
    testDataFrame.addColumn(`trueAdjustClose${lookUpStep}`, yPrediction, { inplace: true });
    testDataFrame.sortIndex({ inplace: true });
    return testDataFrame;
}

let [loss, mae] = model.evaluate(data.x_test, data.y_test, { verbose: 0 });
let meanAbsoluteError;
if (scale) {
    meanAbsoluteError = data.columnScaler.close.inverseTransform(mae).arraySync()[0];
} else {
    meanAbsoluteError = mae.arraySync()[0];
}

let finalDataFrame = getFinalDataFrame();
let futurePrice = predict();
console.log(`Future price after ${lookUpStep} days is ${futurePrice}`);
console.log(`Loss: ${loss}`);
console.log(`Mean Absolute Error: ${meanAbsoluteError}`);
plotGraph(finalDataFrame);

function plotGraph(dataFrame) {
    dataFrame.print();
    console.log(dataFrame[`trueAdjustClose${lookUpStep}`].index);
    let trueData = {
        x: dataFrame[`trueAdjustClose${lookUpStep}`].index,
        y: dataFrame[`trueAdjustClose${lookUpStep}`].values,
        mode: 'line',
        name: 'Predicted Price',
        line: {
            color: 'rgb(255, 0, 0)',
        }
    }
    let data = {
        x: dataFrame[`adjustClose${lookUpStep}`].index,
        y: dataFrame[`adjustClose${lookUpStep}`].values,
        mode: 'line',
        name: 'Actual Price',
        line: {
            color: 'rgb(0, 0, 255)',
        }
    }
    var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
    plotly.plot([data, trueData], graphOptions, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
    });
}