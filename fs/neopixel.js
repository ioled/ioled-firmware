load('api_neopixel.js');
load('api_events.js');

// Get the neopixel pin (15)
let pin = Cfg.get('board.neopixel.pin');
// Get the number of pixels (2).
let numPixels = Cfg.get('board.neopixel.pixels');
// Create a and return a neoPixel strip object.
let strip = NeoPixel.create(pin, numPixels, NeoPixel.GRB);
// RGB colors.
let red = {r: 150, g: 0, b: 0};
let orange = {r: 150, g: 20, b: 10};
let green = {r: 0, g: 50, b: 0};
let blue = {r: 0, g: 0, b: 150};
let yellow = {r: 30, g: 50, b: 60};
let white = {r: 50, g: 50, b: 50};
let purple = {r: 180, g: 0, b: 250};

// Numeric timer ID
let timerId;
// The pixel index.
let pixel = 0;

/**
 * Network search function.
 * @description Pixel blinks on network discover. Stop blinking when connected.
 * When esp8266 is with mode AP Pixel set in blue.
 * @see https://github.com/mongoose-os-libs/mjs/blob/master/fs/api_events.js
 */

let netSearch = function () {
  if (board.ap.state === false) {
    timerId = Timer.set(
      500,
      Timer.REPEAT,
      function () {
        board.timer.timerState = Cfg.get('board.timer.timerState');

        if (MQTT.isConnected() === false) {
          GPIO.set_mode(2, GPIO.MODE_OUTPUT);
          GPIO.toggle(2);

          pixel = (pixel + 1) % numPixels;
          setOnePixel(pixel, white);
        } else if (MQTT.isConnected() === true && !board.timer.timerState) {
          GPIO.set_mode(2, GPIO.MODE_OUTPUT);
          GPIO.write(2, 0);

          setOnePixel(1, white);
        } else if (MQTT.isConnected() === true && board.timer.timerState) {
          GPIO.set_mode(2, GPIO.MODE_OUTPUT);
          GPIO.write(2, 0);

          setOnePixel(1, green);
        }
      },
      null,
    );
  }

  if (board.ap.state === true) {
    timerId = Timer.set(
      200,
      Timer.REPEAT,
      function () {
        GPIO.set_mode(2, GPIO.MODE_OUTPUT);
        GPIO.toggle(2);
        setOnePixel(1, blue);
      },
      null,
    );
  }
};

/**
 *  Paint only one pixel of the strip.
 * @param {number} index The pixel index.
 * @param {{r: number, g: number, b: number}} color RGB color object.
 */
let setOnePixel = function (index, color) {
  strip.clear();
  strip.setPixel(index, color.r, color.g, color.b);
  strip.show();
};

/**
 * Paint all pixels on the strip.
 * @param {{r: number, g: number, b: number}} color RGB color object.
 */
let setAllPixels = function (color) {
  strip.clear();
  for (let i = 0; i < numPixels; i++) {
    strip.setPixel(i, color.r, color.g, color.b);
  }
  strip.show();
};
