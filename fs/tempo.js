load('api_string.js');

/** Initialize timer
 * @description Update all timer values on board start.
 */
let y = [];
let hourOn;
let hourOff;
let minOn;
let minOff;
function initTimer() {
  print('[iOLED-FIRMWARE][initTimer] Initializing timer ...');

  let tempoOn = Cfg.get('board.timer.timerOn');
  tempoOn = JSON.stringify(tempoOn);

  let tempoOff = Cfg.get('board.timer.timerOff');
  tempoOff = JSON.stringify(tempoOff);

  hourOn = JSON.stringify(JSON.parse(tempoOn.slice(1, 3)));
  minOn = JSON.stringify(JSON.parse(tempoOn.slice(4, 6)));
  hourOff = JSON.stringify(JSON.parse(tempoOff.slice(1, 3)));
  minOff = JSON.stringify(JSON.parse(tempoOff.slice(4, 6)));


  board.timer.timerState = Cfg.get('board.timer.timerState');
  board.timer.onIsNext = Cfg.get('board.timer.onIsNext');
  board.timer.timerDuty = Cfg.get('board.timer.timerDuty');

  print('   Timer state: ', board.timer.timerState);
  print('   Timer Duty: ', board.timer.timerDuty);
  print('   Timer On: ' + hourOn + ':' + minOn);
  print('   Timer Off: ' + hourOff + ':' + minOff);

  let time = [];
  for (i = 0; i < 24 ; i++){
    time[i] = i;
  }

  y = vectorTimer(time, hourOn, hourOff);
  for(i = 0; i < 24; i++){
    print(y[i]);
  }
}

let state_timer = true;

/**
 * Turn on/off cron
 * @description Turn on/off cron if state_timer is true
 * @param {boolean} state_timer
 */

let applyTimerConfig = function (obj) {
  board.timer.timerState = Cfg.get('board.timer.timerState');
  Cfg.set({board: {timer: {timerDuty: board.led1.timerDuty}}});
  board.timer.timerDuty = board.led1.duty;

  initTimer();
  let timer = '*/5 * * * * *';
  cronRemove(cronId);
  if (board.timer.timerState) {
    cronId = cronAdd(timer, cronCallbackTimer, null);
  }
};

let cronId = 0;

function cronCallbackTimer(arg, cron_id) {
  let now = Timer.now();
  let timeNow = Timer.fmt('%T', now);
  let hourNow = formatTime('%H', now);
  let minNow = formatTime('%M', now);

  print('[iOLED-FIRMWARE][cronCallbackTimer] Time: ' + timeNow);

  print(y[hourNow]);
  if (y[hourNow]) {
    if (hourNow === hourOn) {
      if (JSON.parse(minNow) >= JSON.parse(minOn)) {
        print(true);
      } else {
        print(false);
      }
    } else {
      print(true)
    }
  } else {
    if (hourNow === hourOff) {
      if (JSON.parse(minNow) >= JSON.parse(minOff)) {
        print(false);
      } else {
        print(true);
      }
    } else {
      print(false)
    }
  }

  // if (board.timer.onIsNext) {
  //   print('[iOLED-FIRMWARE][cronCallbackTimer] On');
  //   applyBoardConfig();
  // } else {
  //   print('[iOLED-FIRMWARE][cronCallbackTimer] Off');
  //   turnOffLed();
  // }
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
  let res = 0, t = Math.round(time || Timer.now()), s = '      ';
  while (res === 0) {
    res = Timer._f(s, s.length, fmt, t);
    if (res === -1) return 'invalid time';
    if (res === 0) s += '     ';
  }
  return s.slice(0, res);
}

function vectorTimer(time, hourOn, hourOff){
  print('[iOLED-FIRMWARE][vectorTimer] Build vector timer ...');

  let timeOn = JSON.parse(hourOn);
  let timeOff = JSON.parse(hourOff);
  if (timeOff > timeOn){
    for(i = 0; i < 24; i++){
      y[i] = 0;
      if (time[i] >= timeOn && time[i] < timeOff){
        y[i] = 1;
      }
    }
  }

  if (timeOn > timeOff){
    for(i = 0; i < 24; i++){
      y[i] = 1;
      if (time[i] >= timeOff && time[i] < timeOn){
        y[i] = 0;
      }
    }
  }

  if (timeOn === timeOff){
    for(i = 0; i < 24; i++){
      y[i] = 0;
    }
  }

  return y
}