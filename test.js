import * as tensorflow from "@tensorflow/tfjs-node";
import {loadData} from "./prediction.js";

let symbol = 'MVZ.A';
let path = `file://${process.cwd()}/models/model-${symbol.replace('.', '_')}`;

let data = await loadData(symbol, true, 15, 50, false, true, 0.2);
let model = await tensorflow.loadLayersModel(`${path}/model.json`);

model.evaluate()
