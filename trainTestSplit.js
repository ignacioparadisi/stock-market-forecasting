import * as dfd from 'danfojs-node';
import * as tf from '@tensorflow/tfjs-node';
import { Tensor } from '@tensorflow/tfjs-core';

export function assert(expr, msg) {
    if (!expr) {
        throw new Error(msg)
    }
}

export function getLength(X) {
    if (X instanceof Tensor) {
        return X.shape[0]
    }
    if (X instanceof dfd.DataFrame || X instanceof dfd.Series) {
        return X.size
    }
    return X.length
}

export function sampleWithoutReplacement(
    size,
    n,
    seed = null
) {
    let curMap = new Map()
    let finalNumbs = []
    let randoms = tf.randomUniform([n], 0, size, 'float32', seed).dataSync()
    for (let i = 0; i < randoms.length; i++) {
        randoms[i] = (randoms[i] * (size - i)) / size
        let randInt = Math.floor(randoms[i])
        let lastIndex = size - i - 1
        if (curMap.get(randInt) === undefined) {
            curMap.set(randInt, randInt)
        }
        if (curMap.get(lastIndex) === undefined) {
            curMap.set(lastIndex, lastIndex)
        }
        let holder = curMap.get(lastIndex)
        curMap.set(lastIndex, curMap.get(randInt))
        curMap.set(randInt, holder)
        finalNumbs.push(curMap.get(lastIndex))
    }

    return finalNumbs
}

/**
 * Validation helper to check if the test/test sizes are meaningful wrt to the
 * size of the data (n_samples)
 */
export function validateShuffleSplit(
    nSamples,
    testSize = undefined,
    trainSize = undefined,
    defaultTestSize = 0.1
) {
    assert(
        trainSize === undefined || typeof trainSize === 'number',
        `Invalid value for trainSize: ${trainSize}. Must be number or undefined`
    )
    assert(
        testSize === undefined || typeof testSize === 'number',
        `Invalid value for testSize: ${testSize}. Must be number or undefined`
    )

    if (testSize === undefined && trainSize === undefined) {
        testSize = defaultTestSize
    }

    if (typeof testSize === 'number') {
        if (
            (Number.isInteger(testSize) &&
                (testSize >= nSamples || testSize <= 0)) ||
            (!Number.isInteger(testSize) && (testSize <= 0 || testSize >= 1))
        ) {
            throw Error(
                `testSize=${testSize} should be either positive and smaller than the number of samples ${nSamples} or a float in the (0, 1) range`
            )
        }
    }

    if (typeof trainSize === 'number') {
        if (
            (Number.isInteger(trainSize) &&
                (trainSize >= nSamples || trainSize <= 0)) ||
            (!Number.isInteger(trainSize) && (trainSize <= 0 || trainSize >= 1))
        ) {
            throw Error(
                `trainSize=${trainSize} should be either positive and smaller than the number of samples ${nSamples} or a float in the (0, 1) range`
            )
        }
    }

    if (
        !Number.isInteger(trainSize) &&
        !Number.isInteger(testSize) &&
        trainSize &&
        testSize &&
        trainSize + testSize > 1
    ) {
        throw Error(
            `The sum of testSize and trainSize = ${
                trainSize + testSize
            }, should be in the (0, 1) range. Reduce testSize and/or trainSize.`
        )
    }

    let nTest
    let nTrain

    if (Number.isInteger(testSize)) {
        nTest = testSize
    } else if (typeof testSize === 'number') {
        nTest = Math.ceil(testSize * nSamples)
    }

    if (Number.isInteger(trainSize)) {
        nTrain = trainSize
    } else if (typeof trainSize === 'number') {
        nTrain = Math.ceil(trainSize * nSamples)
    }

    if (trainSize === undefined) {
        nTrain = nSamples - nTest
    }

    if (testSize === undefined) {
        nTest = nSamples - nTrain
    }

    if (typeof nTrain !== 'number' || typeof nTest !== 'number') {
        throw Error('nTrain and nTest must be a number')
    }

    if (nTrain + nTest > nSamples) {
        throw Error(
            `The sum of trainSize and testSize = ${
                nTrain + nTest
            }, should be smaller than the number of samples ${nSamples}. Reduce testSize and/or trainSize.`
        )
    }
    nTrain = Math.floor(nTrain)
    nTest = Math.floor(nTest)

    if (nTrain === 0) {
        throw Error(
            `With nSamples=${nSamples}, testSize=${testSize} and trainSize=${trainSize}, the resulting train set will be empty. Adjust any of the aforementioned parameters.`
        )
    }

    return [nTrain, nTest]
}

export function getIndices(X, indices) {
    if (X instanceof Tensor) {
        return tf.gather(X, indices)
    }
    if (X instanceof dfd.DataFrame) {
        return X.iloc({ rows: indices })
    }
    if (X instanceof dfd.Series) {
        return X.iloc(indices)
    }
    return indices.map((i) => X[i])
}
/**
 *
 * Helper function that can split training and testing data into different splits.
 * This helps with cross validation and model selection.
 *
 * @example
 * ```typescript
 * import {trainTestSplit} from 'scikitjs'
 *
 * let X = [[5, 6],[8,2],[3,4]]
 * let y = [10, 20, 30]
 *
 * let [XTrain, XTest, yTrain, yTest] = trainTestSplit(X, y, .3)
 * ```
 */
export function trainTestSplit(
    X,
    y,
    testSize = 0.1,
    trainSize = undefined,
    randomState = undefined
) {
    const Xlen = getLength(X);
    const ylen = getLength(y);
    assert(
        Xlen === ylen,
        `X and y don't have the same number of elements. They are of different size`
    )
    let [nTrain, nTest] = validateShuffleSplit(Xlen, testSize, trainSize)
    let shuffledIndices = sampleWithoutReplacement(Xlen, Xlen, randomState)
    let trainIndices = shuffledIndices.slice(0, nTrain)
    let testIndices = shuffledIndices.slice(nTrain)
    return [
        getIndices(X, trainIndices),
        getIndices(X, testIndices),
        getIndices(y, trainIndices),
        getIndices(y, testIndices)
    ]
}
