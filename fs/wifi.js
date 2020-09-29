// Numeric timer ID
let timerId;
// The pixel index.
let pixel = 0;

/**
 * Network search function.
 * @description Pixel blinks on network discover. Stop blinking when connected. 
 * When the connection is true, set the internal timer with the time of the Zone.
 * When esp8266/esp32 is with mode AP Pixel set in blue.
 */
let integratedLED = Cfg.get('board.led0.pin');
let netSearch = function () {
  if (board.ap.state === false) {
    timerId = Timer.set(
      500,
      Timer.REPEAT,
      function () {
        board.timer.timerState = Cfg.get('board.timer.timerState');

        if (MQTT.isConnected() === false) {
          GPIO.set_mode(integratedLED, GPIO.MODE_OUTPUT);
          GPIO.toggle(integratedLED);

          pixel = (pixel + 1) % numPixels;
          setOnePixel(pixel, white);
        } else if (MQTT.isConnected() === true ) {

          let now = Timer.now();
          let hourNow = formatTime('%H', now);
          let minNow = formatTime('%M', now);
          let secNow = formatTime('%S', now);

          setRtcTime(JSON.parse(hourNow), JSON.parse(minNow), JSON.parse(secNow));
          
          if (!board.timer.timerState) {
            GPIO.set_mode(integratedLED, GPIO.MODE_OUTPUT);
            GPIO.write(integratedLED, 1);
            setOnePixel(1, white);
          } else {
            GPIO.set_mode(integratedLED, GPIO.MODE_OUTPUT);
            GPIO.write(integratedLED, 1);
            setOnePixel(1, green);
          }
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
        GPIO.set_mode(integratedLED, GPIO.MODE_OUTPUT);
        GPIO.toggle(integratedLED);
        setOnePixel(1, blue);
      },
      null,
    );
  }
};