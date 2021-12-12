import * as fs from 'fs';
import * as path from 'path';

function stringToInt(val: string): number {
    const asInt = parseInt(val, 10);
    if (asInt === NaN) throw new Error(`Could not convert ${val} to int`);
    return asInt;
}

interface Board {
    // The values that belong to the board, with their position in the board stored beside the value
    values: Record<number, {row: number, column: number}>

    // Running total of how many values in each row have been found
    // The array is of size BOARD_SIZE
    rowScores: number[]

    // Running total of how many values in each column have been found
    // The array is of size BOARD_SIZE
    colScores: number[]
}

const BOARD_SIZE = 5;

function initializeBoards(input: string[], boardSize = BOARD_SIZE): Board[] {
    const boards: Board[] = [];
    while(input.shift() !== undefined) {
        const newBoard: Board = {
            values: {},
            rowScores: Array(boardSize).fill(0),
            colScores: Array(boardSize).fill(0)
        };
        for (let i=0; i<boardSize; i++) {
            const newValues = input.shift().split(' ').filter(val => val.length > 0).map(stringToInt);
            for (let j=0; j<boardSize; j++) {
                newBoard.values[newValues[j]] = {
                    row: j,
                    column: i
                }
            }
        }

        boards.push(newBoard);
    }

    return boards;
}

function markBoardWithNewNumber(newNumber: number, board: Board) {
    if (board.values[newNumber]) {
        const position = board.values[newNumber];
        board.colScores[position.column]++;
        board.rowScores[position.row]++;
    }
}

function markBoardsWithNewNumber(newNumber: number, boards: Board[]) {
    boards.forEach(board => markBoardWithNewNumber(newNumber, board));
}

function returnWinners(boards: Board[]): Board[] {
    return boards.filter(board =>
        (
            !!board.colScores.find(columnScore => columnScore >= BOARD_SIZE) ||
            !!board.rowScores.find(rowScore => rowScore >= BOARD_SIZE)
        )
    );
}

function returnNonWinners(boards: Board[]): Board[] {
    return boards.filter(board =>
        !(
            !!board.colScores.find(columnScore => columnScore >= BOARD_SIZE) ||
            !!board.rowScores.find(rowScore => rowScore >= BOARD_SIZE)
        )
    );
}

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), { encoding: 'utf-8' }).replace('\r', '').split('\n');
const numbersToDraw: number[] = input.shift().split(',').map(stringToInt);

// Part 1 - find the winner
console.log(`Let's play bingo!`);
console.log(``);
let winner: Board | undefined;
let drawnNumbers: number[] = [];
let i = 0;
const boards = initializeBoards([...input]);
while(i < numbersToDraw.length) {
    const draw = numbersToDraw[i];
    console.log(`... ${draw}!`)
    drawnNumbers.push(draw);
    markBoardsWithNewNumber(draw, boards);
    const winners = returnWinners(boards);
    if (winners.length > 0) {
        winner = winners[0];
        break;
    }
    i++;
}

let unmarkedValues = Object.keys(winner.values).map(stringToInt).filter(value => !drawnNumbers.includes(value));
let sum = unmarkedValues.reduce((prev, curr) => prev + curr);
console.log('')
console.log(`Winning value: ${sum * drawnNumbers[i]}`);

// Part 2 - let the squid win
console.log('')
i++;
let nonWinners = returnNonWinners(boards);
while(true) {
    const draw = numbersToDraw[i];
    console.log(`... ${draw}!`)
    drawnNumbers.push(draw);
    markBoardsWithNewNumber(draw, nonWinners);
    const newNonWinners = returnNonWinners(nonWinners);
    if (newNonWinners.length === 0) break;
    nonWinners = newNonWinners;
    i++;
}

const lastWinner = nonWinners[0];
unmarkedValues = Object.keys(lastWinner.values).map(stringToInt).filter(value => !drawnNumbers.includes(value));
sum = unmarkedValues.reduce((prev, curr) => prev + curr);

console.log('')
console.log(`Last winner value: ${sum * drawnNumbers[i]}`);