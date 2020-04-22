load('api_rpc.js');

/* Change the board values via RPC.
 * Dependency must be added - origin: https://github.com/mongoose-os-libs/rpc-uart to send RPC commands via usb.
 * Ex1: mos call board.update '{"led1": { "duty":0.5, "freq":20 }}'
 * Ex2: mos call board.update '{"btn1": { "control": "led1"}}'
 * args is an object. Message from MQTT is a string.
 */
RPC.addHandler('board.update', function(args) {
	return setBoardConfig(args);
});
