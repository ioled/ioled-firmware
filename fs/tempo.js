load('api_string.js');

/** Initialize timer
 * @description Update all timer values on board start.
 */
function initTimer(){
    print("Initializing timer ...")
    cronRemove(cronIdTimerOn);
    cronRemove(cronIdTimerOff);

    let tempoOn = Cfg.get('board.timer.timerOn');
    tempoOn = JSON.stringify(tempoOn);

    let tempoOff = Cfg.get('board.timer.timerOff');
    tempoOff = JSON.stringify(tempoOff);

    let hourOn = JSON.stringify(JSON.parse(tempoOn.slice(1,3)));
    let minOn = JSON.stringify(JSON.parse(tempoOn.slice(4,6)));
    let hourOff = JSON.stringify(JSON.parse(tempoOff.slice(1,3)));
    let minOff = JSON.stringify(JSON.parse(tempoOff.slice(4,6)));

    let timerOn = '0 '+ minOn + ' ' + hourOn +' * * *';
    let timerOff = '0 '+ minOff + ' ' + hourOff +' * * *';

    print("Timer On: " + timerOn);
    print("Timer Off: " + timerOff);
    cronIdTimerOn = cronAdd(timerOn, cronCallbackOn, null);
    cronIdTimerOff = cronAdd(timerOff, cronCallbackOff, null);
}

let state_timer = true;

/**
 * Turn on/off cron 
 * @description Turn on/off cron if state_timer is true
 * @param {boolean} state_timer
 */

let applyTimerConfig = function(obj) {
    state_timer = Cfg.get('board.timer.timerState'); 
    initTimer();
    let timer = '*/5 * * * * *';
    cronRemove(cronId);
    if (state_timer){
        cronId = cronAdd(timer, cronCallbackTimer, null);    
    }     
};

let onIsNext = true;

function cronCallbackTimer(arg, cron_id){
    let now = Timer.now();
    let timestring = Timer.fmt('%T', now);

    print(timestring);
    
    if (onIsNext){
        print("Encendido");
        applyBoardConfig();
    } else {
        print("Apagado");
        turnOffLed();
    }
}

/**
 * Call cron callback (ON)in function with the expression tempo_on_cron 
 * @param {function} cronCallback_on callback for cron ON
 * @param {string} tempo_on_cron cron expression ON
 */
let cronAdd = ffi('int mgos_cron_add(char*, void (*)(userdata, int) ,userdata)');
let cronId  = 0;
let cronIdTimerOn = 0;
let cronIdTimerOff = 0;

function cronCallbackOn(arg, cron_id){
    print("Change of state");
    if (!onIsNext) onIsNext = !onIsNext;
}

function cronCallbackOff(arg, cron_id){
    print("Change of state");
    if (onIsNext) onIsNext = !onIsNext;
}

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