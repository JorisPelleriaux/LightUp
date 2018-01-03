import os
import time

from Adafruit_LED_Backpack import SevenSegment

os.system("sudo systemctl stop clock.service")

# Create display instance on default I2C address (0x70) and bus number.
display = SevenSegment.SevenSegment(address=0x70)

# Alternatively, create a display with a specific I2C address and/or bus.
# display = SevenSegment.SevenSegment(address=0x74, busnum=1)

# Initialize the display. Must be called once before using the display.
display.begin()

# Keep track of the colon being turned on or off.
value = True

while(value):
  value = False
 # Clear the display buffer.
  display.clear()
        # Print a floating point number to the display.
#        display.print_float(i)
        # Set the colon on or off (True/False).
#display.set_colon(colon)
  display.write_display()

