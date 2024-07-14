
# Variables
IP_FILE=~/.config/scripts/yeelight/yeelight-ips
IP_PREFIX=192.168.0
INITIAL_START_IP=20
INITIAL_END_IP=30

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

if [ "$failedIP" ]; then
    truncate -s 0 "$IP_FILE"

    for ((i="$INITIAL_START_IP"; i<="$INITIAL_END_IP"; i++)); do
        if [ "$IP_PREFIX.$i" == "$failedIP" ]; then
            continue
        fi
        echo "$IP_PREFIX.$i" >> "$IP_FILE"
    done
fi

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
# /home/bajic/.config/scripts/yeelight/yeelight.sh: connect: Connection refused
# /home/bajic/.config/scripts/yeelight/yeelight.sh: line 18: /dev/tcp/192.168.0.26/55443: Connection refused
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
    if [[ $errors_found == false && $current_ip != "" ]]; then
        successful_ip=$current_ip
    fi
fi

if [ "$successful_ip" ]; then
    echo "Writing $successful_ip to file under: $IP_FILE"
    echo "$successful_ip" > "$IP_FILE"
else
    echo "No successful IP found, exiting..."
    exit 1
fi

# FALLBACK_START_IP=192.168.0.1
# FALLBACK_END_IP=192.168.0.99
# BATCH_SIZE=11



# # Function to check IPs and execute the Yeelight script
# check_ips() {
#     local ips=("$@")
#     local id_counter=1

#     for ip in "${ips[@]}"; do
#         echo "Executing on ID ${id_counter} [${ip}] ..."
#         OUTPUT=$($YEELIGHT_SCRIPT $YEELIGHT_CMD 2>&1)
#         echo "Command output: $OUTPUT"

#         if [[ $OUTPUT == *"Connection refused"* ]]; then
#             echo "${ip} not available"
#         else
#             echo "Success on ${ip}"
#             echo "${ip}" >> "$TMP_IP_FILE"
#             return 0
#         fi

#         id_counter=$((id_counter + 1))
#     done

#     return 1
# }

# # Initialize the IP list file if necessary
# if [ ! -f "$TMP_IP_FILE" ] || [ ! -s "$TMP_IP_FILE" ]; then
#     fill_ip_file
# fi

# # Create an array of IPs to check
# mapfile -t initial_ips < <(seq -f "192.168.0.%g" ${START_IP##*.} ${END_IP##*.})

# # Check initial IPs
# if ! check_ips "${initial_ips[@]}"; then
#     # Create an array of fallback IPs, excluding the initial range
#     mapfile -t fallback_ips < <(seq -f "192.168.0.%g" ${FALLBACK_START_IP##*.} ${FALLBACK_END_IP##*.} | grep -Ev "^192.168.0.(20|21|22|23|24|25|26|27|28|29|30)$")
    
#     # Check fallback IPs in batches
#     for ((i=0; i<${#fallback_ips[@]}; i+=BATCH_SIZE)); do
#         check_ips "${fallback_ips[@]:i:BATCH_SIZE}" && break
#     done
# fi
