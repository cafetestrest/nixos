
# Variables
IP_FILE=~/.config/scripts/yeelight/yeelight-ips
IP_PREFIX=192.168.0
INITIAL_START_IP=20
INITIAL_END_IP=30

if [[ $# -ge 3 ]]; then
  IP_PREFIX=$3
fi

if [[ $# -ge 2 ]]; then
  INITIAL_END_IP=$2
fi

if [[ $# -ge 1 ]]; then
  INITIAL_START_IP=$1
fi

# check if IP file exists, if not create it
if [ ! -f "$IP_FILE" ]; then
    echo "IP File does not exist, creating it under: $IP_FILE"
    touch $IP_FILE
fi

if [ ! -s "$IP_FILE" ]; then
    echo "IP file under: $IP_FILE is empty, filling it with initial IP's"
    
    for ((i="$INITIAL_START_IP"; i<="$INITIAL_END_IP"; i++)); do
        echo "$IP_PREFIX.$i" >> "$IP_FILE"
    done
fi

failedIP=
~/.config/scripts/yeelight/yeelight-scene.sh 0 On || failedIP=$(cat $IP_FILE)

echo "failedIP: $failedIP"

function reset_ips() {
    truncate -s 0 "$IP_FILE"

    for ((i="$INITIAL_START_IP"; i<="$INITIAL_END_IP"; i++)); do
        if [ "$IP_PREFIX.$i" == "$failedIP" ]; then
            continue
        fi
        echo "$IP_PREFIX.$i" >> "$IP_FILE"
    done
}

if [ "$failedIP" ]; then
    reset_ips
fi

function run_command() {
  echo "running the yeelight command please be patient..."
  output=$(~/.config/scripts/yeelight/yeelight-scene.sh 0 Off)

  # OUTPUT=$(cat <<-END
  # Executing on ID 10 [192.168.0.11] ...   10 "method":"set_power","params":["off"]
  # Executing on ID 1 [192.168.0.20] ...   1 "method":"set_power","params":["off"]
  # 192.168.0.20 not available
  # Executing on ID 2 [192.168.0.21] ...   2 "method":"set_power","params":["off"]
  # 192.168.0.21 not available
  # Executing on ID 3 [192.168.0.22] ...   3 "method":"set_power","params":["off"]
  # 192.168.0.22 not available
  # Executing on ID 4 [192.168.0.23] ...   4 "method":"set_power","params":["off"]
  # 192.168.0.23 not available
  # Executing on ID 5 [192.168.0.24] ...   5 "method":"set_power","params":["off"]
  # 192.168.0.24 not available
  # Executing on ID 6 [192.168.0.25] ...   6 "method":"set_power","params":["off"]
  # 192.168.0.25 not available
  # Executing on ID 7 [192.168.0.26] ...   7 "method":"set_power","params":["off"]
  # /home/user/.config/scripts/yeelight/yeelight.sh: connect: Connection refused
  # /home/user/.config/scripts/yeelight/yeelight.sh: line 18: /dev/tcp/192.168.0.26/55443: Connection refused
  # Executing on ID 8 [192.168.0.27] ...   8 "method":"set_power","params":["off"]
  # 192.168.0.27 not available
  # Executing on ID 9 [192.168.0.28] ...   9 "method":"set_power","params":["off"]
  # 192.168.0.28 not available
  # Executing on ID 10 [192.168.0.29] ...   10 "method":"set_power","params":["off"]
  # Executing on ID 11 [192.168.0.30] ...   11 "method":"set_power","params":["off"]
  # 192.168.0.30 not available
  # END
  # );

  echo "Command output: $output"

  if [ "$output" ]; then
    # Initialize a variable to store the successful IP
    successful_ip="false"
    current_ip=""
    errors_found=false

    # Loop through the command output line by line
    while IFS= read -r line; do
      # Check if the line indicates the start of execution and extract the IP
      if [[ $line =~ Executing\ on\ ID\ [0-9]+\ \[(192\.168\.[0-9]+\.[0-9]+)\] ]]; then
        # If the previous IP had no errors and a current IP was being checked, mark it as successful
        if [[ $errors_found == false && $current_ip != "" ]]; then
            successful_ip=$current_ip
            echo "successful ip: $current_ip"
            break;
        fi
        # Reset for the next IP
        current_ip="${BASH_REMATCH[1]}"
        errors_found=false
      fi

      # Check for error messages
      if [[ $line =~ (not\ available|Connection\ refused) ]]; then
        errors_found=true
      fi
    done <<< "$output"

    # Final check for the last IP
    if [[ $errors_found == false && $current_ip != "" && $current_ip != "false" ]]; then
      if [[ "$failedIP" && "$failedIP" != "" ]]; then
        successful_ip=$current_ip
      fi
    fi
  fi
}

run_command

if [[ "$successful_ip" == "false" ]]; then
    echo "No successful IP found, resetting IPs and trying again..."
    reset_ips
    run_command
fi

if [[ "$successful_ip" != "false" ]]; then
    echo "Writing $successful_ip to file under: $IP_FILE"
    echo "$successful_ip" > "$IP_FILE"
else
    echo "No successful IP found, exiting..."
    exit 1
fi

~/.config/scripts/yeelight/yeelight-scene.sh 0 On
