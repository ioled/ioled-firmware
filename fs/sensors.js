// load('api_i2c.js');

// // Time between each state in seconds
// let time = 5;

// let i2c = I2C.get();
// let addr = 64; //0x40 - 1000000

// let publishState = function () {
//   Timer.set(
//     time * 1000,
//     Timer.REPEAT,
//     function () {
//       let St = I2C.readRegW(i2c, addr, 0xe3); // 1110 0011
//       let temp = -46.85 + (175.72 * St) / Math.pow(2, 16);

//       let Srh = I2C.readRegW(i2c, addr, 0xe5); // 1110 0101
//       let hum = -6 + (125 * Srh) / Math.pow(2, 16);

//       print('[iOLED-FIRMWARE][publishState] Publishing state ...');
//       print('   humidity: ', hum);
//       print('   temperature: ', temp);
//       print('   duty: ', board.led1.duty);

//       // let res = MQTT.pub(stateTopic, JSON.stringify({temp: temp, hum: hum}), 1);
//       // print('   Published:', res ? 'yes' : 'no');
//       // print('');
//     },
//     null,
//   );
// };
