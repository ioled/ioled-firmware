// Libraries.
load('api_config.js');
load('api_gpio.js');
load('api_timer.js');
load('api_pwm.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_rpc.js');

// Modules.
load('board.js');
load('sensors.js');
load('neopixel.js');
load('tempo.js');
load('mqtt.js');

// Initialize all led stored config and timer
initBoard();
setButton();
// initTimer();

// Neopixel Network search.
netSearch();

// Connect to the mqtt topic.
connectMqtt();
commandsMqtt();

// Public temp and hum
publishState();
