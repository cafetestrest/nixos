
# Variables
IP_PREFIX="192.168.0"
INITIAL_START_IP=20
INITIAL_END_IP=30
IP_FILE=~/.config/scripts/yeelight/yeelight-ips

if [[ $# -ge 3 ]]; then
  IP_PREFIX=$3
fi

if [[ $# -ge 2 ]]; then
  INITIAL_END_IP=$2
fi

if [[ $# -ge 1 ]]; then
  INITIAL_START_IP=$1
fi

# Create file if it doesn't exist
if [ ! -f "$IP_FILE" ]; then
    echo "File $IP_FILE not found. Creating it..."
    touch "$IP_FILE"
fi

# Fill the file with the first IP if it's empty
# if [ ! -s "$IP_FILE" ]; then
    echo "${IP_PREFIX}.${INITIAL_START_IP}" > "$IP_FILE"
# fi

# Read the current IP from the file
CURRENT_IP=$(cat "$IP_FILE")

# Function to check if the command test-scene.sh runs successfully
check_command() {
    sleep 0.5
    # OUTPUT=$(~/.config/scripts/yeelight/yeelight-scene.sh 0 Off 2>&1)
    OUTPUT=$(~/.config/scripts/yeelight/yeelight-scene.sh 0 On 2>&1)
    echo $OUTPUT

    if [[ "$OUTPUT" == *"not available"* || "$OUTPUT" == *"refused"* ]]; then
        return 1  # Failure
    else
        return 0  # Success
    fi
}

# Loop until we reach the end IP or find a working one
while true; do
    echo "Testing IP: $CURRENT_IP"
    
    # Try running the command
    if check_command; then
        echo "Command succeeded with IP: $CURRENT_IP"
        sleep 0.5
        ~/.config/scripts/yeelight/yeelight-scene.sh 0 Off
        sleep 0.5
        ~/.config/scripts/yeelight/yeelight-scene.sh 0 On
        exit 0
    else
        echo "$CURRENT_IP not available. Trying next IP..."
        
        # Increment IP
        CURRENT_IP_NUM=${CURRENT_IP##*.}
        NEXT_IP_NUM=$((CURRENT_IP_NUM + 1))
        
        if [ "$NEXT_IP_NUM" -gt "$INITIAL_END_IP" ]; then
            echo "Reached the end IP: ${IP_PREFIX}.${INITIAL_END_IP}. Exiting."
            exit 1
        fi
        
        # Update the IP in the file
        NEW_IP="${IP_PREFIX}.${NEXT_IP_NUM}"
        echo "$NEW_IP" > "$IP_FILE"
        CURRENT_IP="$NEW_IP"
    fi
done
