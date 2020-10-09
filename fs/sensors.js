// Time between each state in seconds
let time = 60;

// Initialize SHT20
let i2c = I2C.get();

// Addres for SHT20
let addr = 64; //0x40 - 1000000

/**
 * Send state to Google Cloud
 * @description Send state to Google Cloud IoT Core
 * TODO: Do measure of sensor every second and send to cloud in 1 minute. Add real filter
 * TODO: add online state here? 
 */
let publishState = function () {
  Timer.set(
    time * 1000,
    Timer.REPEAT,
    function () {
      let St = I2C.readRegW(i2c, addr, 0xe3); // 1110 0011
      let temp = -46.85 + (175.72 * St) / Math.pow(2, 16);

      let Srh = I2C.readRegW(i2c, addr, 0xe5); // 1110 0101
      let hum = -6 + (125 * Srh) / Math.pow(2, 16);

      print('[iOLED-FIRMWARE][publishState] Publishing state ...');
      print('   humidity: ', hum);
      print('   temperature: ', temp);
      print('   duty: ', board.led1.duty);
      
      let res = MQTT.pub(stateTopic, JSON.stringify({temp: temp, hum: hum}, 1));
      print('   Published:', res ? 'yes' : 'no');
      print('');
    },
    null,
  );
};

/**
 * Filter for temperature meause
 * @description Filter the temperature reading
 * TODO: Add filter like kalman or digital filter
 * @param {int} temp The led name from the board object.
 */
let tempFilter = function(temp) {
  let tempFilter;
  
  if (temp < 0) {
    tempFilter = 0;
  }
  if (tempFilter > 100) {
    tempFilter = 0;
  }

  return tempFilter;
};

/**
 * Filter for humidity meause
 * @description Filter the humidity reading
 * TODO: Add filter like kalman or digital filter
 * @param {int} temp The led name from the board object.
 */
let humFilter = function(hum) {
  let humFilter;

  if (hum < 0) {
    humFilter = 0;
  }
  if (humFilter > 100) {
    humFilter = 0;
  }

  return humFilter;
};




