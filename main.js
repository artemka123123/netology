const http = require('http')

require('dotenv').config({path: ".env"})

const key = process.env.APIKey || require("./config.js").APIKey
const url = `http://api.weatherstack.com/current?access_key=${key}`

const yargs = require("yargs");
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
    .command("weather [city]", "Вывод погоды", (yargs) => {
        return yargs
            .positional("city", {
                alias: "c",
                description: "Город",
                type: "string"
            })
    }, (args) => {
        const reqUrl = `${url}&query=${args.city}`

        http.get(reqUrl, (res) => {
            res.setEncoding('utf8')

            var data = ''
            res.on('data', (chunk) => data += chunk)

            res.on('end', () => {
                let parsedData = JSON.parse(data)

                if (parsedData.error) {
                    var err = parsedData.error

                    console.log(`Ошибка ${err.code}!\n`)

                    console.log(`Тип: ${err.type}`)
                    console.log(`Информация: ${err.info}`)

                    return
                }

                var currentWeather = parsedData.current

                console.log(`Город: ${parsedData.request.query}`)
                console.log(`Время: ${currentWeather.observation_time}\n`)

                console.log(`Температура: ${currentWeather.temperature} (Ощущается как ${currentWeather.feelslike})`)
                console.log(`Скорость ветра: ${currentWeather.wind_speed}`)
                console.log(`Атмосферное давление: ${currentWeather.pressure}`)

            })
        }).on('error', (err) => {
            console.error(err)
        })
    })
    .parse()