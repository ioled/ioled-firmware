load('api_i2c.js');

// Initialize MCP4725
let i2c_MCP4725 = I2C.get();

// Addres for MCP4725
let addrMCP = 96;

/**
 * Analog to digital
 * @description Write in MCP4725 for i2c to have analog output
 * FIXME: Fix function, the problem is, When fix this function?
 * @param {int} duty Number betwen 0-1
 */
let dutyToAnalog = function (duty) {
	//   // print('[dutyToAnalog] duty:', duty);
	//   let output = duty * 4095;
	//   let firstByte = (output>>4);
	//   let data = '\x40' + chr(firstByte) + '\xff';
	//   let result = I2C.write(i2c_MCP4725, addrMCP, data, data.length, true);
	//   if (result) {
	//     // print('I2C write sucess')
	//   } else print('Failure');
};
