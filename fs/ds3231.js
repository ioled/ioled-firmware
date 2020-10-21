let DS3231_I2C_addresss = 0x68;

// Initialize DS3231 library
let rtc = DS3231.create(DS3231_I2C_addresss);

/**
 * Set the timer en DS3231
 * @description Set the internal timer in DS3231
 * @param {[time]} time hours, minutes and seconds
 */
let setRtcTime = function (hours, minutes, seconds) {
	rtc.setTimeSeconds(seconds);
	rtc.setTimeMinutes(minutes);
	rtc.setTimeHours(hours);
};

/**
 * Set the date en DS3231
 * @description Set the internal date in DS3231
 * @param {[date]} date date, month and year
 */
let setRtcDate = function (date, month, year, dayOfWeek) {
	rtc.setTimeDate(date);
	rtc.setTimeMonth(month);
	rtc.setTimeYear(year);
	rtc.setTimeDayOfTheWeek(dayOfWeek);
};
