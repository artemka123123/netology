const yargs = require("yargs");
const fs = require("fs")

const { hideBin } = require('yargs/helpers')

const arguments = yargs(hideBin(process.argv))
    .positional("log", {
        default: "game.log"
    }).argv

const logPath = arguments.log
if (!fs.existsSync(logPath)) {
    console.log("Такого файла нет!")

    return;
}

var total = 0
var won = 0

const readerStream = fs.createReadStream(logPath)
readerStream.setEncoding("UTF-8")

readerStream.on("data", (chunk) => {
    chunk.split("").forEach(game => {
        total += 1
        won += parseInt(game)
    })
})

readerStream.on("end", () => {
    console.log(`Общее количество партий: ${total}`)
    console.log(`Выиграно партий: ${won}`)
    console.log(`Проиграно партий: ${total - won}`)
})