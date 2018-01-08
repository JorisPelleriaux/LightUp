#!/usr/bin/python

import time
import datetime
import subprocess

from Adafruit_LED_Backpack import SevenSegment

inittime = 0
# ===========================================================================
# Clock Example
# ===========================================================================
segment = SevenSegment.SevenSegment(address=0x70)

# Initialize the display. Must be called once before using the display.
segment.begin()

# Keep track of the colon being turned on or off.
colon = False

print "Press CTRL+Z to exit"

#noIP => 0x54 0x5C 0x6 0x73
#boot => 0x7C 0x5C 0x5C 0x78

#Print 'boot' to display for 15sec
segment.clear()
segment.set_digit_raw(0, 0x7C)
segment.set_digit_raw(1, 0x5C)
segment.set_digit_raw(2, 0x5C)
segment.set_digit_raw(3, 0x78)
segment.set_colon(colon)
segment.write_display()
time.sleep(5.0)

#Get ip
ipaddr = subprocess.check_output(['hostname', '-I'])
ipsplit = ipaddr.split(' ')
ipv4 = ipsplit[0].split('.')

#Print ip address 3x
print ipsplit[0]
while(inittime<10):
  for i in ipv4:
	try:
            segment.clear()
            segment.print_float(int(i), decimal_digits=0, justify_right=True)
            segment.set_colon(colon)
            segment.write_display()
            inittime+=1
	    time.sleep(1.0)
	except ValueError:
            print "Could not convert data to an integer."
	    print ipsplit[0]
	    segment.clear()
 	    segment.set_digit_raw(0, 0x54)
	    segment.set_digit_raw(1, 0x5C)
	    segment.set_digit_raw(2, 0x6)
	    segment.set_digit_raw(3, 0x73)
	    segment.set_colon(colon)
	    segment.write_display()
	 
	else:
	    print "other error"
	 #   segment.clear()
	 #   segment.set_digit_raw(0, 0x54)
	 #   segment.set_digit_raw(1, 0x5C)
	 #   segment.set_digit_raw(2, 0x6)
	 #   segment.set_digit_raw(3, 0x73)
	 #   segment.set_colon(colon)
	 #   segment.write_display()

	    

# Continually update the time on a 4 char, 7-segment display
while(True):
  now = datetime.datetime.now()
  hour = now.hour
  minute = now.minute
  second = now.second

  segment.clear()
  # Set hours
  segment.set_digit(0, int(hour / 10))     # Tens
  segment.set_digit(1, hour % 10)          # Ones
  # Set minutes
  segment.set_digit(2, int(minute / 10))   # Tens
  segment.set_digit(3, minute % 10)        # Ones
  # Toggle colon
  segment.set_colon(second % 2)              # Toggle colon at 1Hz

  # Write the display buffer to the hardware.  This must be called to
  # update the actual display LEDs.
  segment.write_display()

  # Wait a quarter second (less than 1 second to prevent colon blinking getting$
  time.sleep(0.25)
