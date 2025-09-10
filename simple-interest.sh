#!/bin/bash

# Simple Interest Calculator Script

# Input values
echo "Enter Principal Amount:"
read principal
echo "Enter Rate of Interest:"
read rate
echo "Enter Time (in years):"
read time

# Calculate Simple Interest
si=$(( (principal * rate * time) / 100 ))

# Display result
echo "The Simple Interest is: $si"
