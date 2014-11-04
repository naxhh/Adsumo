#!/bin/sh
# INDONESIA

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.199.194.0
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.199.194.100
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.199.199.254
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.199.207.208
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.199.207.220
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.97.112.240

# INDIA
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.203.11.0
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/116.203.12.255
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.91.187.10

# CHINA

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.77.64.1
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.78.99.0
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.81.97.250
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.48.18.151

# TAIWAN

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.99.128.1

# MALAYSIA
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/118.100.82.250

# THAILAND

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.46.91.0

# PHILIPINES

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.92.76.39
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.92.78.135
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.92.79.199

# KOREA

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.202.201.0

# NEW ZELAND

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.224.55.255

# JAPAN

curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/119.224.248.254
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/121.111.244.134

# NOT EXISTING IPS
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/11.11.11.11
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/192.168.11.1
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/1
curl -w "@test/format.txt" -o /dev/null -s http://localhost:3000/api/v1/ip/asd
