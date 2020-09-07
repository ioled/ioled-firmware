load('api_string.js');

/** Initialize timer
 * @description Update all timer values on board start.
 */
let yHour = [];
let yMin = [];
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

  let timeHour = [];
  for (let i = 0; i < 24 ; i++){
    timeHour[i] = i;
  }

  yHour = vectorTimerHour(timeHour, hourOn, hourOff, minOn, minOff);

  for (let i = 0; i < 24 ; i++){
    print(yHour[i]);
  }

  let timeMin = [];
  if (hourOn === hourOff) {
    for (let i = 0; i < 60 ; i++){
      timeMin[i] = i;
    } 
    yMin = vectorTimerMin(timeMin, minOn, minOff);
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
  let hourNow = rtc.getTimeHours();
  let minNow = rtc.getTimeMinutes();

  print('[cronCallbackTimer] Hour: ' + JSON.stringify(hourNow));
  print('[cronCallbackTimer] Min: ' + JSON.stringify(minNow));


  if (hourOn !== hourOff) {
    if (yHour[hourNow]) {
      if (JSON.parse(hourNow) === JSON.parse(hourOn)) {
        if (JSON.parse(minNow) >= JSON.parse(minOn)) {
          print('On')
          applyBoardConfig();
        } else {
          print('Off');
          turnOffLed();
        }
      } else {
        print('On')
        applyBoardConfig();
      }
    } else {
      if (hourNow === hourOff) {
        if (JSON.parse(minNow) >= JSON.parse(minOff)) {
          print('Off');
          turnOffLed();
        } else {
          print('On')
          applyBoardConfig();
        }
      } else {
        print('Off');
        turnOffLed();
      }
    }
  }

  // if (JSON.parse(hourOn) === JSON.parse(hourOff)){
  //   if (yHour[JSON.parse(hourNow)]) {
  //     if (JSON.parse(hourNow) === JSON.parse(hourOn)) {
  //       print(yMin[JSON.parse(minNow)]);
  //     } else {
  //       print('On')
  //       applyBoardConfig();
  //     }
  //   } else {
  //     if (JSON.parse(hourNow) === JSON.parse(hourOff)) {
  //       print(yMin[JSON.parse(minNow)]);
  //     } else {
  //       print('Off');
  //       turnOffLed();
  //     }
  //   }
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

function vectorTimerHour(time, hourOn, hourOff, minOn, minOff){
  print('[iOLED-FIRMWARE][vectorTimerHour] Build Hour vector timer ...');

  let hourOn = JSON.parse(hourOn);
  let hourOff = JSON.parse(hourOff);
  let minOn = JSON.parse(minOn);
  let minOff = JSON.parse(minOff);

  if (hourOff > hourOn){
    for(i = 0; i < 24; i++){
      yHour[i] = 0;
      if (time[i] >= hourOn && time[i] < hourOff){
        yHour[i] = 1;
      }
    }
  }

  if (hourOn > hourOff){
    for(let i = 0; i < 24; i++){
      yHour[i] = 1;
      if (time[i] >= hourOff && time[i] < hourOn){
        yHour[i] = 0;
      }
    }
  }

  if (hourOn === hourOff){
    if (minOn > minOff){
      for(let i = 0; i < 24; i++){
        yHour[i] = 1;
      }
      yHour[hourOn] = 0;
    }

    if (minOff > minOn){
      for(let i = 0; i < 24; i++){
        yHour[i] = 0;
      }
      yHour[hourOn] = 1;
    }
    
  }

  return yHour
}



function vectorTimerMin(time, minOn, minOff){
  print('[iOLED-FIRMWARE][vectorTimerHour] Build Minute vector timer ...');

  let minOn = JSON.parse(minOn);
  let minOff = JSON.parse(minOff);

  if (minOff > minOn){
    for(i = 0; i < 60; i++){
      yMin[i] = 0;
      if (time[i] >= minOn && time[i] < minOff){
        yMin[i] = 1;
      }
    }
  }

  if (minOn > minOff){
    for(i = 0; i < 60; i++){
      yMin[i] = 1;
      if (time[i] >= minOff && time[i] < minOn){
        yMin[i] = 0;
      }
    }
  }

  return yMin
}