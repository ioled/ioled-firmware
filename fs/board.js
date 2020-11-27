/**
 * Object with the esp config.
 * Each key (i.e led1, led2, ...) must have the same name
 * with the one declared in the mos.yml file.
 */
let esp = {
	btn1: {
		pin: Cfg.get('esp.btn1.pin'),
	},
	ap: {
		state: Cfg.get('esp.ap.state'),
	},
	led1: {
		onhi: Cfg.get('esp.led1.active_high'),
		duty: Cfg.get('esp.led1.duty'),
		freq: Cfg.get('esp.led1.freq'),
		pin: Cfg.get('esp.led1.pin'),
		state: Cfg.get('esp.led1.state'),
	},
	led2: {
		onhi: Cfg.get('esp.led2.active_high'),
		duty: Cfg.get('esp.led2.duty'),
		freq: Cfg.get('esp.led2.freq'),
		pin: Cfg.get('esp.led2.pin'),
		state: Cfg.get('esp.led2.state'),
	},
	timer: {
		timerOn: Cfg.get('esp.timer.timerOn'),
		timerOff: Cfg.get('esp.timer.timerOff'),
		timerState: Cfg.get('esp.timer.timerState'),
		onIsNext: Cfg.get('esp.timer.onIsNext'),
		timerDuty: Cfg.get('esp.timer.timerDuty'),
	},
	neopixel: {
		pin: Cfg.get('esp.neopixel.pin'),
	},
	ramp: {
		rampState: Cfg.get('esp.ramp.rampState'),
		onTime: Cfg.get('esp.ramp.onTime'),
		offTime: Cfg.get('esp.ramp.offTime'),
		dutyRamp: Cfg.get('esp.ramp.rampDuty'),
	},
};

/** Initialize esp.
 * @description Update all led values on esp start and set GPIO modes.
 */
let initEsp = function () {
	print('[initEsp] Initializing esp ...');
	GPIO.set_mode(esp.led1.pin, GPIO.MODE_OUTPUT);
	GPIO.set_mode(esp.led2.pin, GPIO.MODE_OUTPUT);

	// let dayNow = rtc.getTimeDayOfTheWeek();
	let ds = DS3231.create(DS3231_I2C_addresss);
	let dt = DS3231DateTime.create();

	let hourNow = ds.read().getHour();
	let minNow = ds.read().getMinute();

	ds.free();
	dt.free();

	print('   Hour: ' + JSON.stringify(hourNow));
	print('   Min: ' + JSON.stringify(minNow));
	print('   led1 pin:', esp.led1.pin);
	print('   led2 pin:', esp.led2.pin);
	print('   button1 pin:', esp.btn1.pin);
	print('   neopixel pin:', esp.neopixel.pin);
	print('   AP state:', esp.ap.state);
	print('   duty %: ', esp.led1.duty);
	print('   duty state: ', esp.led1.state);

	Cfg.set({wifi: {ap: {enable: false}}}); // Able WiFi AP mode
	Cfg.set({esp: {ap: {state: false}}});

	applyEspConfig();
};

/**
 * Get the configuration from the cloud and set it to the mos.yml file.
 * @param {string | Object} msg String with the configuration message.
 */
let getConfigFromCloud = function (msg) {
	print('[getConfigFromCloud] MSG:');
	print(msg);
	let obj = JSON.parse(msg);
	Cfg.set(obj);
	return obj;
};

/**
 * Apply the configuration to all leds
 * @description Load all the led configuration from the mos.yml file and apply it to the esp.
 */
let applyEspConfig = function () {
	print('[applyespConfig]');

	for (let ledName in esp) {
		if (ledName.indexOf('led') >= 0) {
			applyLedConfig(ledName);
		}
	}
	print('');
};

/**
 * Apply a single led configuration.
 * @description Load a single led configuration from the esp.
 * @param {string} ledName The led name from the esp object.
 */
let applyLedConfig = function (ledName) {
	let led = esp[ledName];
	let brd = 'esp.' + ledName + '.';
	led.onhi = Cfg.get(brd + 'active_high');

	led.duty = Cfg.get(brd + 'duty');

	led.freq = Cfg.get(brd + 'freq');
	led.state = Cfg.get(brd + 'state');
	normDuty(ledName);
	changeLED(ledName);
};

/**
 * Turn off all led.
 * @description Put all led duty in 0.
 * @param {string} ledName The led name from the esp object.
 */
let turnOffLed = function () {
	print('[turnOffLed]');
	for (let ledName in esp) {
		if (ledName.indexOf('led') >= 0) {
			let led = esp[ledName];
			led.duty = 0;
			normDuty(ledName);
			PWM.set(led.pin, led.freq, led.duty);
			dutyToAnalog(led.duty);
			print('   ', ledName, 'intensity: ', led.duty);
		}
	}
	print('');
};

/**
 * Normalize the value of the duty cycle between 0 - 1.
 * @param {string} ledName The led name from the esp object.
 */
let normDuty = function (ledName) {
	let led = esp[ledName];
	if (led.duty >= 1) {
		led.duty = 1;
		return;
	}
	if (led.duty <= 0) {
		led.duty = 0;
		return;
	}
	led.duty = led.duty;
};

/**
 * Change the state of the led between PWM - off
 * @param {string} ledName The led name from the esp object.
 * @see https://github.com/mongoose-os-libs/pwm/blob/master/mjs_fs/api_pwm.js
 */
let changeLED = function (ledName) {
	let led = esp[ledName];

	if (Cfg.get('esp.timer.timerState')) {
		PWM.set(led.pin, led.freq, led.duty);
		dutyToAnalog(led.duty);
		print('   ', ledName, 'intensity: ', led.duty);
	} else {
		PWM.set(led.pin, led.freq, led.duty);
		dutyToAnalog(led.duty);
		print('   ', ledName, 'intensity: ', led.duty);
	}
};

/**
 * Set the device button function.
 * @see https://github.com/mongoose-os-libs/mjs/blob/master/fs/api_gpio.js
 */
let setButton = function () {
	GPIO.set_button_handler(
		esp.btn1.pin,
		GPIO.PULL_UP,
		GPIO.INT_EDGE_NEG,
		5000,
		function () {
			Cfg.set({wifi: {ap: {enable: true}}}); // Able WiFi AP mode
			Cfg.set({esp: {ap: {state: true}}}); // Able WiFi AP mode
		},
		null,
	);
};
