/**
 * Object with the board config.
 * Each key (i.e led1, led2, ...) must have the same name
 * with the one declared in the mos.yml file.
 */
let board = {
  btn1: {
    pin: Cfg.get('board.btn1.pin'),
  },
  ap: {
    state: Cfg.get('board.ap.state'),
  },
  led1: {
    onhi: Cfg.get('board.led1.active_high'),
    duty: Cfg.get('board.led1.duty'),
    freq: Cfg.get('board.led1.freq'),
    pin: Cfg.get('board.led1.pin'),
    state: Cfg.get('board.led1.state'),
  },
  led2: {
    onhi: Cfg.get('board.led2.active_high'),
    duty: Cfg.get('board.led2.duty'),
    freq: Cfg.get('board.led2.freq'),
    pin: Cfg.get('board.led2.pin'),
    state: Cfg.get('board.led2.state'),
  },
  timer: {
    timerOn: Cfg.get('board.timer.timerOn'),
    timerOff: Cfg.get('board.timer.timerOff'),
    timerState: Cfg.get('board.timer.timerState'),
  },
};

/** Initialize board.
 * @description Update all led values on board start and set GPIO modes.
 */
let initBoard = function () {
  print('[iOLED-FIRMWARE][initBoard]');
  print('Initializing board ...');

  GPIO.set_mode(board.led1.pin, GPIO.MODE_OUTPUT);
  GPIO.set_mode(board.led2.pin, GPIO.MODE_OUTPUT);

  print('led1 pin:', board.led1.pin);
  print('led2 pin:', board.led2.pin);
  print('button1 pin:', board.btn1.pin);
  print('AP state:', board.ap.state);

  Cfg.set({wifi: {ap: {enable: false}}}); // Able WiFi AP mode
  Cfg.set({board: {ap: {state: false}}});

  applyBoardConfig();
};

/**
 * Change the state of the led between PWM - off
 * @param {string} ledName The led name from the board object.
 * @see https://github.com/mongoose-os-libs/pwm/blob/master/mjs_fs/api_pwm.js
 */
let switchLed = function (ledName) {
  print('[iOLED-FIRMWARE][switchLED]', ledName);

  let led = board[ledName];

  PWM.set(led.pin, led.freq, led.duty);
  print('[iOLED-FIRMWARE][switchLED]', ledName, ':', led.duty);

  print(ledName, 'state:', led.state ? 'true' : 'false');
  print(ledName, 'intensity: ', led.duty);
};

/**
 * Get the configuration from the cloud and set it to the mos.yml file.
 * @param {string | Object} msg String with the configuration message.
 * @example // update led1 and led2 with 0.5 duty and 20 freq.
 * // msg : {"board": {"led1":{"freq":20, "duty": 0.5, "state": true}, "led2":{"freq":20, "duty": 0.5, "state": true}}}
 */
let getConfigFromCloud = function (msg) {
  print('[iOLED-FIRMWARE]][getConfigFromCloud] MSG:');
  print(msg);

  let obj = JSON.parse(msg);
  Cfg.set(obj);
  return obj;
};

/**
 * Apply the configuration to all leds.
 * @description Load all the led configuration from the mos.yml file and apply it to the board.
 */
let applyBoardConfig = function () {
  for (let ledName in board) {
    if (ledName.indexOf('led') >= 0) {
      applyLedConfig(ledName);
    }
  }
};

/**
 * Apply a single led configuration.
 * @description Load a single led configuration from the board.
 * @param {string} ledName The led name from the board object.
 */
let applyLedConfig = function (ledName) {
  let led = board[ledName];
  let brd = 'board.' + ledName + '.';
  led.onhi = Cfg.get(brd + 'active_high');
  led.duty = Cfg.get(brd + 'duty');
  led.freq = Cfg.get(brd + 'freq');
  led.state = Cfg.get(brd + 'state');
  normDuty(ledName);
  switchLed(ledName);
};

/**
 * Turn off all led.
 * @description Put all led duty in 0.
 * @param {string} ledName The led name from the board object.
 */
let turnOffLed = function (ledName) {
  for (let ledName in board) {
    if (ledName.indexOf('led') >= 0) {
      let led = board[ledName];
      let brd = 'board.' + ledName + '.';
      led.onhi = 1;
      led.duty = Cfg.get(brd + 'duty');
      led.freq = Cfg.get(brd + 'freq');
      led.state = false;
      normDuty(ledName);
      switchLed(ledName, false);
    }
  }
};

/**
 * Normalize the value of the duty cycle between 0 - 1.
 * @param {string} ledName The led name from the board object.
 */

GPIO.set_mode(0, GPIO.MODE_OUTPUT);

let normDuty = function (ledName) {
  print('[iOLED-FIRMWARE][normDuty]', ledName);

  let led = board[ledName];
  if (led.duty >= 1) {
    led.duty = 1;
    GPIO.write(0, 1);
    print('[iOLED-FIRMWARE][normDuty]', ledName, ':', led.duty);
    return;
  }
  if (led.duty <= 0) {
    led.duty = 0;
    GPIO.write(0, 0);
    print('[iOLED-FIRMWARE][normDuty]', ledName, ':', led.duty);
    return;
  }
  led.duty = led.duty;
  GPIO.write(0, 1);
  print('[iOLED-FIRMWARE][normDuty]', ledName, ':', led.duty);
};

/**
 * Set the device button function.
 * @see https://github.com/mongoose-os-libs/mjs/blob/master/fs/api_gpio.js
 */
let setButton = function () {
  GPIO.set_button_handler(
    board.btn1.pin,
    GPIO.PULL_UP,
    GPIO.INT_EDGE_NEG,
    5000,
    function () {
      Cfg.set({wifi: {ap: {enable: true}}}); // Able WiFi AP mode
      Cfg.set({board: {ap: {state: true}}}); // Able WiFi AP mode
    },
    null,
  );
};
