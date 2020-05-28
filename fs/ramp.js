/**
 * Start a with ramp
 * @description Light on with a
 * @param {string} period Time of ramp
 */
let timerRamp = 0;
let realDuty = 0;
let deltaDuty = 0;
let dutyMax = 0;
let startRamp = function (xTime, dutyRamp) {
  if (board.ramp.state) {
    let h = 1;
    let n = (xTime * 60) / h;

    realDuty = 0;
    deltaDuty = dutyRamp / n;
    dutyMax = dutyRamp;
    print('[iOLED-FIRMWARE][startRamp] Initializing ramp ON ...');
    print('[iOLED-FIRMWARE][startRamp] n: ', n);
    print('[iOLED-FIRMWARE][startRamp] deltaDuty: ', deltaDuty);

    timerRamp = Timer.set(
      h * 1000,
      Timer.REPEAT,
      function () {
        realDuty = realDuty + deltaDuty;
        Cfg.set({board: {led1: {duty: realDuty}}});
        Cfg.set({board: {led2: {duty: realDuty}}});
        board.timer.led1 = board.timer.realDuty;
        board.timer.led2 = board.timer.realDuty;

        applyBoardConfig();
        if (realDuty >= dutyMax) {
          Timer.del(timerRamp);
        }
        applyBoardConfig();
        print('[iOLED-FIRMWARE][startRamp] rampDuty: ', realDuty);
      },
      null,
    );
  } else {
    realDuty = board.led1.duty;
  }
};
