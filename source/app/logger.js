'use strict';

const axios = require('axios');
const fs = require('fs');

class Logger {

    constructor() {    
        this.log_file = "door_log.csv";    
    }

    async Log(isOpen) {
        let log_item = await this.CreateLogString(isOpen);

        try {
            fs.appendFileSync('log.csv', '\n' + log_item);
        }
        catch(err) {
            console.log("Error logging to file: "+ err);
        }
    }

    async CreateLogString(isOpen) {

        let timestamp = new Date();
        let day_of_week = timestamp.getDay();
        let temp = "NA";
        let weather = "NA";
        let isDaytime = "NA";

        // Get temp and weather from NOAA
        async function getWeatherData() {
            return axios({
                url: 'https://api.weather.gov/gridpoints/PQR/114,103/forecast/hourly',
                method: 'get',
                timeout: 3000})
                .then(response => {
                    temp = response.data.properties.periods[0].temperature;
                    weather = response.data.properties.periods[0].shortForecast;
                    isDaytime = response.data.properties.periods[0].isDaytime;
                })
                .catch(err => console.log("Fetch error:" + err))
        }

        await getWeatherData();

        let log_item = `${timestamp.toISOString()},${isOpen},${day_of_week},${temp},${isDaytime},${weather}`;
        return log_item;

    }

}

module.exports = Logger;