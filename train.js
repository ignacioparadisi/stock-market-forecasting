import { loadData, createModel } from "./prediction.js";
import * as tensorflow from '@tensorflow/tfjs-node';

let symbol = 'MVZ.A';
let data = await loadData(symbol, true, 15, 50, false, true, 0.2);
let model = createModel(50, 1, 256, 2, false, 0.4, "meanAbsoluteError", "adam");

let x = data["x_train"];
let y = data["y_train"];
console.log('==================== Y Train ==================');
console.log(y);

let history = await model.fit(x, y, {
    batchSize: 64,
    epochs: 50,
    validationData: [data["x_test"], data["y_test"]],
    verbose: 1,
    callbacks: {
        onEpochEnd: async (epoch, log) => {
            console.log(epoch);
            console.log(log);
        }
    }
});

let path = `file://${process.cwd()}/models/model-${symbol.replace('.', '_')}`
console.log(`Saving model into ${path}`);
await model.save(path);

let result = { model, history };
