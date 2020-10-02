# IoT firmware iOLED version 2.0
Este repositorio contiene el firmare de la placa IoT iOLED. El dispositivo se conecta al GCP y a través del
protocolo MQTT recibe y manda mensajes. 

El dispositivo sensa humedad y temperatura con el sensor SHT20 cada 1 minuto. El dispositivo cuenta con un reloj interno: DS3231, 
que actualiza la hora cada vez que se conecta a internet. El control de intensidad se realiza con un DAC: MCP4725.

## API
* Neopixel: https://github.com/mongoose-os-libs/neopixel
* CRON: https://github.com/mongoose-os-libs/cron
* I2C: https://github.com/mongoose-os-libs/i2c
* DS3231: https://github.com/mongoose-os-libs/arduino-ds3231
 

## Next updates
* Rampa de encendido

