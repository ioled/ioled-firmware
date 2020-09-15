load('api_i2c.js');

let i2c_MCP4725 = I2C.get();
let addrMCP = 96; 

let dutyToAnalog = function (duty) {
  // print('[dutyToAnalog] duty:', duty);
  let output = duty * 4095;
  let firstByte = (output>>4);

  let data = '\x40' + chr(firstByte) + '\xff';
  let result = I2C.write(i2c_MCP4725, addrMCP, data, data.length, true);
  if (result) {
    // print('I2C write sucess') 
  } else print('Failure');
};
