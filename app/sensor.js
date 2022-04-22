// Provides interface to the door sensor
'use strict';

const input_pin = 23;

// Dummy class that replaces hardware sensor
class sensorSimulaiton {

    constructor() {
        this.val = 1;   // default value
    }

    set value(val) {
        this.val = val;
    }

    readSync() {
        return this.val;
    }
}

class Sensor {

    constructor(isSimulaiton = false) {
        this.isSimulaiton = isSimulaiton;

        if(isSimulaiton) {
            this.gpio_sensor = new sensorSimulaiton();
        }
        else {
            // real hardware 
            // Set up the sensor input
            var gpio = require('onoff').Gpio;
            console.log('Reading input from GPIO pin: ' + input_pin);
            this.gpio_sensor = new gpio(input_pin, 'in', 'both');
        }
    }

    SetSimulationValue(val) {
        if (this.isSimulaiton) {
            this.gpio_sensor.val = val;
        }
    }

    ReadInput() {
        var val = this.gpio_sensor.readSync();
        // console.log("pin value: " + val);
        return val;
    }
}

module.exports = Sensor;

