import * as fs from 'fs';
import * as path from 'path';

function stringToInt(val: string): number {
    const asInt = parseInt(val, 10);
    if (asInt === NaN) throw new Error(`Could not convert ${val} to int`);
    return asInt;
}

function MCBOfColumn(data: string[], columnIndex: number, oddsBreaker: 0 | 1) {
    // Keep a running count as a quick way to determine MCB.
    let runningCount = 0;
    for (let row = 0; row < data.length; row++) {
        runningCount += stringToInt(data[row][columnIndex]);
    }

    // Check for same number of 0s and 1s
    if (runningCount === (data.length / 2)) return oddsBreaker;
    else return runningCount > (data.length / 2) ? 1 : 0;
}

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), { encoding: 'utf-8' });
const readings = input.split('\r\n');

// Part 1
let gammaString = '', epsilonString = '';
for (let col = 0; col < readings[0].length; col++) {
    const columnMCB = MCBOfColumn(readings, col, 0);
    gammaString += ''+columnMCB;
    epsilonString += ''+(1-columnMCB);
}

const gammaRate = parseInt(gammaString, 2), epsilonRate = parseInt(epsilonString, 2);
console.log(`Part 1. GammaRate: ${gammaRate} (${gammaString}), EpsilonRate: ${epsilonRate} (${epsilonString}). Power: ${gammaRate * epsilonRate}`);

// Part 2
function getRating(data: string[], desire: 'MCB' | 'LCB') {
    let col = 0;
    while (data.length > 1) {
        if (col >= data[0].length) throw new Error('Could not compute rating');
        const columnMCB = MCBOfColumn(data, col, 1);
        const desiredBit = desire === 'MCB' ? columnMCB : 1 - columnMCB;
        data = data.filter((reading) => stringToInt(reading[col]) === desiredBit);
        col++;
    }
    return data[0];
}

const oxygenGeneratorRating = getRating(readings, 'MCB');
const CO2ScrubberRating = getRating(readings, 'LCB');
const lifeSupportRating = parseInt(oxygenGeneratorRating, 2) * parseInt(CO2ScrubberRating, 2);
console.log(`Part 2. Life Support Rating: ${lifeSupportRating}`);
