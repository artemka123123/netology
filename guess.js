#!/usr/bin/env node

const readline = require("node:readline");
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

var guessNum = Math.floor(Math.random() * 100)

function guess(num) {
    var message = (num > guessNum ? "Меньше" : "Больше") + "\n"

    if (guessNum != num) {
        rl.question(message, guess)

        return
    }

    console.log(`Отгадано число ${num}!\n`)
    rl.close()
}

rl.question('Загадано число в диапазоне от 0 до 100\n', guess);