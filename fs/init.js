// Libraries.
load('api_config.js');
load('api_gpio.js');
load('api_timer.js');
load('api_pwm.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_rpc.js');
load('api_ds3231.js');
load('api_i2c.js');

// Modules.
load('board.js');
load('sensors.js');
load('neopixel.js');
load('wifi.js');
load('tempo.js');
load('mqtt.js');
load('ds3231.js');
load('mcp4725.js');

// Initialize all led stored config, timer and ramp
initBoard();
initTimer();
setButton();

// Neopixel Network search.
netSearch();

// Connect to the mqtt topic.
connectMqtt();

// Public temp and hum
publishState();
