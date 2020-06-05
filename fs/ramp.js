/**
 * Start a with ramp
 * @description Light on with a
 * @param {string} period Time of ramp
 */
let timerRamp = 0;
let realDuty = 0;
let deltaDuty = 0;
let dutyMax = 0;
let i = 0;
let startRamp = function (xTime, dutyRamp) {
  board.ramp.rampState = Cfg.get('board.ramp.rampState');

  if (board.ramp.rampState) {
    i = 0;
    let h = 1;
    let n = (xTime * 60) / h;

    realDuty = 0.07;
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
        Cfg.set({board: {ramp: {rampDuty: realDuty}}});
        applyBoardConfig();
        i = i + 1;
        if (realDuty >= dutyMax) {
          Timer.del(timerRamp);
        }
        applyBoardConfig();
        print('[iOLED-FIRMWARE][startRamp] i: ', i);
        print('[iOLED-FIRMWARE][startRamp] rampDuty: ', realDuty);
      },
      null,
    );
  }
};
