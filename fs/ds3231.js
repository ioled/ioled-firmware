let DS3231_I2C_addresss = 0x68;

// Initialize DS3231 library
let rtc = DS3231.create(DS3231_I2C_addresss);

let setRtcTime = function (hours, minutes, seconds) {
	rtc.setTimeSeconds(seconds);
	rtc.setTimeMinutes(minutes);
	rtc.setTimeHours(hours);
};


// Timer.set(1000 /* milliseconds */, true /* repeat */, function () {
// 	print('Time: ', rtc.getTimeHours(), ':', rtc.getTimeMinutes(), ':', rtc.getTimeSeconds());
//   print(' ')
// }, null);