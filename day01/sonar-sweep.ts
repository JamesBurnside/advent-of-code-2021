import * as fs from 'fs';
import * as path from 'path';

const stringToInt = (val: string): number => parseInt(val, 10);

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), { encoding: 'utf-8' });
const measurements = input.split('\n').map((measurement) => stringToInt(measurement));

// Part 1
let increased = 0;
measurements.forEach((curr, i) => i > 0 && curr > measurements[i-1] && increased++);
console.log(`Part 1: ${increased}`);

// Part 2
const slidingWindowSize = 3;
increased = 0;
measurements.forEach((curr, i) => i >= slidingWindowSize && curr > measurements[i-slidingWindowSize] && increased++);
console.log(`Part 2: ${increased}`);