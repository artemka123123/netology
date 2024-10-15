const readline = require("node:readline");
const yargs = require("yargs");
const fs = require("fs")

const { hideBin } = require('yargs/helpers')

const { stdin: input, stdout: output } = require('node:process');
const path = require("node:path");
const rl = readline.createInterface({ input, output });

const arguments = yargs(hideBin(process.argv))
    .positional("log", {
        default: "game.log"
    }).argv

const logPath = arguments.log
if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "")
}

var flipCoin = () => Math.floor(Math.random() * 2) + 1

function game(answer) {
    var won = flipCoin() == answer
    var message = won ? "Вы отгадали число!" : "Вы не отгадали число"

    console.log(`${message}\n`)
    fs.appendFileSync(logPath, `${won ? 1 : 0}`)

    rl.question("Отгадайте число (1 или 2)\n", game)
}

rl.question("Отгадайте число (1 или 2) \n", game)