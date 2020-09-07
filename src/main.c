#include "mgos.h"
#include "driver/dac.h"


int DAC_function(int V) {
  dac_output_enable (DAC_CHANNEL_1);
  dac_output_voltage (DAC_CHANNEL_1, V);
  return V;
}