// Topic to send events.
let commandsTopic = '/devices/' + Cfg.get('device.id') + '/commands';
// Topic to receive config.
let configTopic = '/devices/' + Cfg.get('device.id') + '/config';
// Topic to send state data.
let stateTopic = '/devices/' + Cfg.get('device.id') + '/state';

/**
 * Subscribe to a MQTT topic and receive config data from IoT Core.
 * @configTopic (str): mqtt topic to subscribe.
 * @param {string } topic Mqtt topic.
 * @param {string} msg config message from the cloud.
 * @see https://github.com/mongoose-os-libs/mqtt/blob/master/mjs_fs/api_mqtt.js
 */
let connectMqtt = function () {
	print('Connecting to Mqtt topic: ', configTopic);
	MQTT.sub(configTopic, function (conn, topic, msg) {
		getConfigFromCloud(msg);
		if (Cfg.get('board.timer.timerState')) {
			// applyTimerConfig();
			initTimer();
		} else {
			// applyTimerConfig();
			applyBoardConfig();
			setOnePixel(1, purple);
		}
	});
};
