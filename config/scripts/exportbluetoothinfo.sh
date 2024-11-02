
# Function to convert hexadecimal to decimal
hex_to_decimal() {
    if [ -z "$1" ]; then
        echo "No hex value provided"
        return 1
    fi
    
    hex_value=$1

    # Use printf to convert hex to unsigned decimal
    decimal_value=$(printf "%u" "$((16#$hex_value))")

    if [ $# -gt 1 ]; then
        echo "$2$decimal_value"
    else
        echo "$decimal_value"
    fi
}

# Function to process Rand or ERand argument with byte reversal
process_rand() {
    if [ -z "$1" ]; then
        echo "No Rand/ERand value provided"
        return 1
    fi

    # Remove prefixes if any
    rand_value=$(echo "$1" | sed -E 's/^("?[Ee]?[Rr]?[Aa]?[Nn]?[Dd]?"?=hex\(b\):|hex\(b\):)//I')
    
    # Reverse byte order
    reversed_hex=$(echo "$rand_value" | tr -d ',' | sed 's/../& /g' | awk '{for(i=NF;i>0;i--) printf "%s", $i; print ""}')
    
    # Convert reversed hex to decimal
    if [ -z "$2" ]; then
        hex_to_decimal "$reversed_hex"
    else
        hex_to_decimal "$reversed_hex" "$2"
    fi
}

# Function to process LTK or CSRK arguments
process_hex_string() {
    if [ -z "$1" ]; then
        echo "No value provided"
        return 1
    fi

    value=$(echo "$1" | sed -E 's/^(("?[A-Za-z]+"?=)?hex:|dword:)//I')
    value=$(echo "$value" | tr -d ',' | tr '[:lower:]' '[:upper:]')

    if [ -z "$2" ]; then
        echo "$value"
    else
        echo "$2$value"
    fi
}

# Function to process EDIV or Length-related arguments
process_dword() {
    if [ -z "$1" ]; then
        echo "No dword value provided"
        return 1
    fi

    dword_value=$(echo "$1" | sed -E 's/^(("?[A-Za-z]+"?=)?dword:)//I')

    if [ -z "$2" ]; then
        hex_to_decimal "$dword_value"
    else
        hex_to_decimal "$dword_value" "$2"
    fi
}

# Main script logic
while [[ $# -gt 0 ]]; do
    case "$1" in
        --hex|hex)
            hex_to_decimal "$2"
            shift 2
            ;;
        --ltk|ltk)
            process_hex_string "$2" "[LongTermKey]
Key="
            shift 2
            ;;
        --length|length|keylength|encsize|--keylength|--encsize)
            process_dword "$2" "EncSize="
            shift 2
            ;;
        --ediv|ediv)
            process_dword "$2" "EDiv="
            shift 2
            ;;
        --rand|rand|--erand|erand)
            process_rand "$2" "Rand="
            shift 2
            ;;
        --csrk|csrk)
            process_hex_string "$2" "
[LocalSignatureKey]
Key="
            shift 2
            ;;
        *)
            echo "Usage: $0 --ltk <ltk_value> | --rand <rand_value> | --erand <erand_value> | --length <length_value> | --keylength <keylength_value> | --encsize <encsize_value> | --ediv <ediv_value> | --csrk <csrk_value>"
            echo "To sync bluetooth device info on dual boot so that devices can be used with both systems."
            echo "Edit and rename manually per device 'info' files from /var/lib/bluetooth/ using: 'su root'"
            echo "Based on: https://console.systems/2014/09/how-to-pair-low-energy-le-bluetooth.html"
            exit 1
            ;;
    esac
done
