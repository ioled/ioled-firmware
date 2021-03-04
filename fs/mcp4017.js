print('MCP 4017')

// Initialize MCP4017
let i2c_MC4017 = I2C.get();

// Addres for MCP4725
let addrResistor = 47;

/**
 * Analog to digital
 * @description Write in MCP4725 for i2c to have analog output
 * FIXME: Fix function, the problem is, When fix this function?
 * @param {int} duty Number betwen 0-1
 */
let changeResistor = function (duty) {
	  print('[changeResistor] duty:', duty);
	  let output = duty * 2047;
	  let firstByte = (output>>4);
	  let data = chr(firstByte);
	  let result = I2C.write(i2c_MC4017, addrResistor, data, data.length, true);
	  if (result) {
	    print('I2C write sucess')
	  } else print('Failure');
};

