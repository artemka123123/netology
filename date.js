#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
    .command("current", "Вывод текущей даты", (yargs) => {
        return yargs
            .option("year", { 
                alias: "y",
                description: "Вывод года"
            })
            .option("month", {
                alias: "m",
                description: "Вывод месяца"
            })
            .option("date", {
                alias: "d",
                description: "Вывод даты в календарном месяце"
            })
    }, (args) => {
        var currentDate = new Date()

        if (args.year) {
            console.log(`Текущий год: ${currentDate.getFullYear()}`)

            return;
        }
        
        if (args.month) {
            console.log(`Текущий месяц: ${currentDate.getMonth()}`)

            return
        }

        if (args.date) {
            console.log(`Дата в календарном месяце: ${currentDate.getDate()}`)

            return
        }

        console.log(`Дата в ISO: ${currentDate.toISOString()}`)
    })
    .command("add [val]", "Вывод даты в будущем", (yargs) => {
        return yargs
            .positional("val", {})
            .option("year", {
                alias: "y"
            }) 
            .option("month", {
                alias: "m"
            })
            .option("date", {
                alias: "d"
            })
    }, (args) => {
        var currentDate = new Date()

        if (args.year) currentDate.setFullYear(currentDate.getFullYear() + args.val)
        if (args.month) currentDate.setMonth(currentDate.getMonth() + args.val)
        if (args.date) currentDate.setDate(currentDate.getDate() + args.val)

        console.log(`Дата в формате ISO: ${currentDate.toISOString()}`)
    })
    .command("sub [val]", "Вывод даты в прошлом", (yargs) => {
        return yargs
        .positional("val", {})
        .option("year", {
            alias: "y"
        }) 
        .option("month", {
            alias: "m"
        })
        .option("date", {
            alias: "d"
        })
    }, (args) => {
        var currentDate = new Date()

        if (args.year) currentDate.setFullYear(currentDate.getFullYear() - args.val)
        if (args.month) currentDate.setMonth(currentDate.getMonth() - args.val)
        if (args.date) currentDate.setDate(currentDate.getDate() - args.val)

        console.log(`Дата в формате ISO: ${currentDate.toISOString()}`)
    })
    .parse()