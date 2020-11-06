load('api_string.js');

let yHour = [];
let yMin = [];
let hourOn;
let hourOff;
let minOn;
let minOff;
let cronId = 0;

/** Initialize timer
 * FIXME: Fix function
 * @description Update all timer values on board start.
 */
function initTimer() {
	print('[initTimer] Initializing timer ...');

	let tempoOn = Cfg.get('board.timer.timerOn');
	tempoOn = JSON.stringify(tempoOn);

	let tempoOff = Cfg.get('board.timer.timerOff');
	tempoOff = JSON.stringify(tempoOff);

	hourOn = JSON.stringify(JSON.parse(tempoOn.slice(1, 3)));
	minOn = JSON.stringify(JSON.parse(tempoOn.slice(4, 6)));
	hourOff = JSON.stringify(JSON.parse(tempoOff.slice(1, 3)));
	minOff = JSON.stringify(JSON.parse(tempoOff.slice(4, 6)));

	board.timer.timerState = Cfg.get('board.timer.timerState');
	board.timer.timerDuty = Cfg.get('board.timer.timerDuty');

	print('   Timer state: ', board.timer.timerState);
	print('   Timer Duty: ', board.timer.timerDuty);
	print('   Timer On: ' + hourOn + ':' + minOn);
	print('   Timer Off: ' + hourOff + ':' + minOff);

	let timeHour = [];
	for (let i = 0; i < 24; i++) {
		timeHour[i] = i;
	}

	yHour = vectorTimerHour(timeHour, hourOn, hourOff, minOn, minOff);

	let timeMin = [];
	if (hourOn === hourOff) {
		for (let i = 0; i < 60; i++) {
			timeMin[i] = i;
		}
		yMin = vectorTimerMin(timeMin, minOn, minOff);
	}

	cronRemove(cronId);
	cronId = cronAdd('*/5 * * * * *', cronCallbackTimer, null);
}

let state_timer = true;
let hourReset = 19;
function cronCallbackTimer(arg, cron_id) {
	let hourNow = rtc.getTimeHours();
	let minNow = rtc.getTimeMinutes();
	let dayNow = rtc.getTimeDayOfTheWeek();

	print('[cronCallbackTimer] Hour: ' + JSON.stringify(hourNow));
	print('[cronCallbackTimer] Min: ' + JSON.stringify(minNow));
	print('[cronCallbackTimer] Day: ' + JSON.stringify(dayNow));
	print('');

	if (Cfg.get('board.timer.timerState')) {
		if (hourOn !== hourOff) {
			if (yHour[hourNow]) {
				if (hourNow === JSON.parse(hourOn)) {
					if (minNow >= JSON.parse(minOn)) {
						print('On');
						applyBoardConfig();
					} else {
						print('Off');
						turnOffLed();
					}
				} else {
					print('On');
					applyBoardConfig();
				}
			} else {
				if (hourNow === JSON.parse(hourOff)) {
					if (minNow >= JSON.parse(minOff)) {
						print('Off');
						turnOffLed();
					} else {
						print('On');
						applyBoardConfig();
					}
				} else {
					print('Off');
					turnOffLed();
				}
			}
		}

		if (JSON.parse(hourOn) === JSON.parse(hourOff)) {
			if (yHour[hourNow]) {
				if (hourNow === JSON.parse(hourOn)) {
					if (yMin[minNow]) {
						applyBoardConfig();
					} else {
						turnOffLed();
					}
				} else {
					applyBoardConfig();
				}
			} else {
				if (hourNow === JSON.parse(hourOff)) {
					if (yMin[minNow]) {
						applyBoardConfig();
					} else {
						turnOffLed();
					}
				} else {
					turnOffLed();
				}
			}
		}
	}

	// Reset every day
	if (hourNow >= hourReset && minNow <= 0) {
		print('[cronCallbackTimer] Daily reset ...');
		Sys.reboot(1);
	}
}

/**
 * Call cron callback (ON)in function with the expression tempo_on_cron
 * @param {function} cronCallback_on callback for cron ON
 * @param {string} tempo_on_cron cron expression ON
 */
let cronAdd = ffi('int mgos_cron_add(char*, void (*)(userdata, int) ,userdata)');

/**
 * Delete cron entry with a given cron ID
 * @param {int} cron_id
 */
let cronRemove = ffi('void mgos_cron_remove(int)');

function formatTime(fmt, time) {
	if (!fmt) return 'invalid format';
	let res = 0,
		t = Math.round(time || Timer.now()),
		s = '      ';
	while (res === 0) {
		res = Timer._f(s, s.length, fmt, t);
		if (res === -1) return 'invalid time';
		if (res === 0) s += '     ';
	}
	return s.slice(0, res);
}

/**
 * Create vectorTimerHour
 * @description Create vector of hour for timer
 * @param {[time]} time time, hourOn, hourOff, minOn, minOff
 */
function vectorTimerHour(time, hourOn, hourOff, minOn, minOff) {
	print('[vectorTimerHour] Build Hour vector timer ...');

	let hourOn = JSON.parse(hourOn);
	let hourOff = JSON.parse(hourOff);
	let minOn = JSON.parse(minOn);
	let minOff = JSON.parse(minOff);

	if (hourOff > hourOn) {
		for (let i = 0; i < 24; i++) {
			yHour[i] = 0;
			if (time[i] >= hourOn && time[i] < hourOff) {
				yHour[i] = 1;
			}
		}
	}

	if (hourOn > hourOff) {
		for (let i = 0; i < 24; i++) {
			yHour[i] = 1;
			if (time[i] >= hourOff && time[i] < hourOn) {
				yHour[i] = 0;
			}
		}
	}

	if (hourOn === hourOff) {
		if (minOn > minOff) {
			for (let i = 0; i < 24; i++) {
				yHour[i] = 1;
			}
			yHour[hourOn] = 0;
		}

		if (minOff > minOn) {
			for (let i = 0; i < 24; i++) {
				yHour[i] = 0;
			}
			yHour[hourOn] = 1;
		}
	}

	return yHour;
}

/**
 * Create vectorTimerMin
 * @description Create vector of minute for timer
 * @param {[time]} time time, minOn, minOff
 */
function vectorTimerMin(time, minOn, minOff) {
	print('[iOLED-FIRMWARE][vectorTimerHour] Build Minute vector timer ...');

	let minOn = JSON.parse(minOn);
	let minOff = JSON.parse(minOff);

	if (minOff > minOn) {
		for (let i = 0; i < 60; i++) {
			yMin[i] = 0;
			if (time[i] >= minOn && time[i] < minOff) {
				yMin[i] = 1;
			}
		}
	}

	if (minOn > minOff) {
		for (let i = 0; i < 60; i++) {
			yMin[i] = 1;
			if (time[i] >= minOff && time[i] < minOn) {
				yMin[i] = 0;
			}
		}
	}

	return yMin;
}
