// Numeric timer ID
let timerId;

// The pixel index.
let pixel = 0;

let integratedLED = Cfg.get('esp.led0.pin');
let integratedState = Cfg.get('esp.led0.state');
GPIO.set_mode(integratedLED, GPIO.MODE_OUTPUT);

/**
 * Network search function.
 * @description Pixel blinks on network discover. Stop blinking when connected.
 * When the connection is true, set the internal timer with the time of the Zone.
 * When esp8266/32 is in mode AP, set NEO pixel in blue.
 */
let netSearch = function () {
	if (esp.ap.state === false) {
		timerId = Timer.set(
			500,
			Timer.REPEAT,
			function () {
				esp.timer.timerState = Cfg.get('esp.timer.timerState');

				if (MQTT.isConnected() === false) {
					GPIO.toggle(integratedLED);

					pixel = (pixel + 1) % numPixels;
					setOnePixel(pixel, white);
				} else if (MQTT.isConnected() === true) {
					let now = Timer.now();
					let hourNow = formatTime('%H', now);
					let minNow = formatTime('%M', now);
					let secNow = formatTime('%S', now);

					let dayNow = formatTime('%d', now);
					let monthNow = formatTime('%m', now);
					let yearNow = formatTime('%y', now);
					let dayOfWeekNow = formatTime('%u', now);

					let ds = DS3231.create(DS3231_I2C_addresss);
					let dt = DS3231DateTime.create();

					dt.setDate(JSON.parse(yearNow), JSON.parse(monthNow), JSON.parse(dayNow));
					dt.setTime(JSON.parse(hourNow), JSON.parse(minNow), JSON.parse(secNow));

					ds.write(dt);
					ds.free();
					dt.free();
					// setRtcTime(JSON.parse(hourNow), JSON.parse(minNow), JSON.parse(secNow));
					// setRtcDate(
					// 	JSON.parse(dayNow),
					// 	JSON.parse(monthNow),
					// 	JSON.parse(yearNow),
					// 	JSON.parse(dayOfWeekNow),
					// );

					if (!esp.timer.timerState) {
						GPIO.write(integratedLED, integratedState);
						setOnePixel(1, white);
					} else {
						GPIO.write(integratedLED, integratedState);
						setOnePixel(1, green);
					}
				}
			},
			null,
		);
	}

	if (esp.ap.state === true) {
		timerId = Timer.set(
			200,
			Timer.REPEAT,
			function () {
				GPIO.toggle(integratedLED);
				setOnePixel(1, blue);
			},
			null,
		);
	}
};
