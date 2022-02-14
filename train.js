import { loadData, createModel } from "./prediction.js";
import * as tensorflow from '@tensorflow/tfjs-node';

let data = await loadData('MZV.A-VS', 15, 50, true, true, 0.2);
let model = createModel(50, 1, 256, 2, false, 0.4, "meanAbsoluteError", "adam");

function onTrainEnd(logs) {
    console.log(logs);
}

console.log(data["x_train"])
console.log('---------')
console.log(data["y_train"]);

model.fit(data["x_train"], data["y_train"], {
    batchSize: 64,
    epochs: 10,
    validationData: [data["x_test"], data["y_test"]],
    verbose: 1,
    callbacks: { onTrainEnd }
})
