import * as fs from 'fs';
import * as path from 'path';

const stringToInt = (val: string): number => {
    const asInt = parseInt(val, 10);
    if (asInt === NaN) throw new Error(`Could not convert ${val} to int`);
    return asInt;
}

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), { encoding: 'utf-8' });
const instructions = input.split('\n');

// Part 1
let posX = 0, posY = 0;
for (const instruction of instructions) {
    const [instructionType, amount] = instruction.split(' ');
    switch(instructionType) {
        case 'forward': posX += stringToInt(amount); break;
        case 'down': posY += stringToInt(amount); break;
        case 'up': posY -= stringToInt(amount); break;
        default: throw new Error(`Unknown instruction ${instructionType}`)
    }
}
console.log(`Part 1. horizontal: ${posX}, depth: ${posY}, result: ${posX*posY}`);

// Part 2
posX = 0
posY = 0;
let aim = 0;
for (const instruction of instructions) {
    const [instructionType, amount] = instruction.split(' ');
    switch(instructionType) {
        case 'forward': posX += stringToInt(amount); posY += stringToInt(amount)*aim; break;
        case 'down': aim += stringToInt(amount); break;
        case 'up': aim -= stringToInt(amount); break;
        default: throw new Error(`Unknown instruction ${instructionType}`)
    }
}

console.log(`Part 2. horizontal: ${posX}, depth: ${posY}, result: ${posX*posY}`);