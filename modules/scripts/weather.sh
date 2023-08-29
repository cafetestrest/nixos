#!/usr/bin/env bash

Ags=0
Latitude=""
Longitude=""
debug=0

# location of the config key, it contains the following (lat and long) data:
ConfigFile="$HOME/.config/ags/weather_key"

if [ "$1" == "-r" ]; then
    shift
    ConfigFile="$1"
    shift
fi

if [ -f "$ConfigFile" ]; then
    readarray -t line < "$ConfigFile"
    Latitude=${line[0]}
    Longitude=${line[1]}
fi

if [[ "$Latitude" == "" || "$Longitude" == "" ]]; then
    echo "Wrong Config file."
    exit 1
fi

firstArg="$(echo "$1")"

if [[ $firstArg == "ags" ]]; then
    Ags=1
fi

if [[ $firstArg == "debug" ]]; then
    debug=1
fi

# Calculate cache file path based on latitude and longitude
CacheFile="/tmp/weather_cache_${Latitude}_${Longitude}.json"

# Check if cache file exists and is less than 5 minutes old
if [ -f "$CacheFile" ] && [ $(($(date +%s) - $(date -r "$CacheFile" +%s))) -lt 300 ]; then
    if [ "$debug" = "1" ]; then
        echo 'DATA FROM CACHE'
    fi

    response=$(cat "$CacheFile")
else
    if [ "$debug" = "1" ]; then
        echo 'API REQUEST TO GET DATA'
    fi

    # API endpoint URL (complete or compact)
    URL="https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=$Latitude&lon=$Longitude"

    # Make the API request using curl
    # response=$(curl -s -H "User-Agent: YourApp/1.0 (your@email.com)" -H "Authorization: Bearer $API_KEY" "$URL")
    response=$(curl -s "$URL")

    # Check if the request was successful
    if [ $? -ne 0 ]; then
        echo "Error making API request"
        exit 1
    fi

    # Save response to cache file
    echo "$response" > "$CacheFile"
fi

if [ "$debug" = "1" ]; then
    echo $response
fi

# weather icon used like so: get_weather_icon $weather_icon1
function get_weather_icon() {
    nightIcon="🌑"
    if [ "$1" == "clearsky_night" ]; then
        # Generate a random number between 1 and 5
        random_number=$(( RANDOM % 5 + 1 ))

        # Check the random number and provide different outputs
        if [ $random_number -eq 1 ]; then
            nightIcon="🌕"
        fi
    fi

    weather_icon=$1
    case $1 in
        "clearsky_day") weather_icon="☀️";;
        "clearsky_night") weather_icon=$nightIcon;;
        "cloudy_day") weather_icon="☁️";;
        "cloudy_night") weather_icon="";;
        "fog_day") weather_icon="";;
        "fog_night") weather_icon="";;
        "heavyrain_day") weather_icon="⛈️";;
        "heavyrain_night") weather_icon="󰙾";;
        "lightrain_day") weather_icon="🌦️";;
        "lightrain_night") weather_icon="";;
        "partlycloudy_day") weather_icon="⛅";;
        "partlycloudy_night") weather_icon="";;
        "rainshowers_day") weather_icon="🌧️";;
        "rainshowers_night") weather_icon="";;
        "snow_day") weather_icon="🌨";;
        "snow_night") weather_icon="";;
        "sleet_day") weather_icon="🌨️";;
        "sleet_night") weather_icon="";;
        *) weather_icon="";;  # Default icon if code is not recognized
    esac
}

# retrieve icon from the API, if not for the next 1 hour, try for 6, 12 or use a previous one that is defined
function get_weather_icon_to_display() {
    weather_icon1=$(echo "$entry" | jq -r '.data.next_1_hours.summary.symbol_code')
    weather_icon6=$(echo "$entry" | jq -r '.data.next_6_hours.summary.symbol_code')
    weather_icon12=$(echo "$entry" | jq -r '.data.next_12_hours.summary.symbol_code')

    get_weather_icon $weather_icon1
    icon1=$weather_icon

    get_weather_icon $weather_icon6
    icon6=$weather_icon

    get_weather_icon $weather_icon12
    icon12=$weather_icon

    iconToDisplay=""
    if [ $icon1 ]; then
        iconToDisplay=$icon1
    fi
    if [[ ! $iconToDisplay && $icon6 ]]; then
        iconToDisplay=$icon6
    fi
    if [[ ! $iconToDisplay && $icon12 ]]; then
        iconToDisplay=$icon12
    fi
    if [ ! $iconToDisplay ]; then
        iconToDisplay=$previousIcon
    fi

    if [ $iconToDisplay ]; then
        previousIcon=$iconToDisplay
    fi

    if [ "$debug" = "1" ]; then
        echo "$human_date / icon = $iconToDisplay / icon1 $icon1 / icon6 $icon6 / icon12 $icon12"
    fi
}

# retrieve rain amount from the API, if not for the next 1 hour, try for 6, 12 or use a previous one that is defined
function get_rain_amount_to_display() {
    rain_amount=$(echo "$entry" | jq -r '.data.next_1_hours.details.precipitation_amount')
    rain_amount6=$(echo "$entry" | jq -r '.data.next_6_hours.details.precipitation_amount')
    rain_amount12=$(echo "$entry" | jq -r '.data.next_12_hours.details.precipitation_amount')

    rainAmountToDisplay=""
    if [[ $rain_amount != 'null' ]]; then
        rainAmountToDisplay=$rain_amount
    fi
    if [[ ! $rainAmountToDisplay && $rain_amount6 != 'null' ]]; then
        rainAmountToDisplay=$rain_amount6
    fi
    if [[ ! $rainAmountToDisplay && $rain_amount12 != 'null' ]]; then
        rainAmountToDisplay=$rain_amount12
    fi
    if [[ ! $rainAmountToDisplay ]]; then
        rainAmountToDisplay=$previousRainAmount
    fi

    if [ $rainAmountToDisplay ]; then
        previousRainAmount=$rainAmountToDisplay
    fi

    if [ "$debug" = "1" ]; then
        echo "$human_date / rain = $rainAmountToDisplay / rain1 $rain_amount / rain6 $rain_amount6 / rain12 $rain_amount12"
    fi
}

# weather data information
function weather_info() {
    if [ "$debug" == "0" ]; then
        output+="{\"dayOfWeek\":\"$dayOfWeek\",\"hourFromDate\":\"$hourFromDate\",\"temperature\":\"${temperature}°C\",\"icon\":\"$iconToDisplay\",\"wind\":\"$wind_speed$wind_speed_unit\",\"rain\":\"${rainAmountToDisplay} ${precipitation_amount_unit}\",\"humidity\":\"${relative_humidity}${relative_humidity_unit}\",\"minTemp\":\"${min_temp}°C\",\"maxTemp\":\"${max_temp}°C\"},"
    else
        echo "Date: $human_date, Time: $hour:00"
        echo "Temperature: $temperature°C"
        echo "Min Temp: $min_temp°C"
        echo "Max Temp: $max_temp°C"
        echo "Humidity: ${relative_humidity} ${relative_humidity_unit}"
        echo "Wind Speed: ${wind_speed}${wind_speed_unit}"
        echo "Rain Amount 1h: ${rain_amount} ${precipitation_amount_unit}"
        echo "Rain Amount 6h: ${rain_amount6} ${precipitation_amount_unit}"
        echo "Rain Amount 12h: ${rain_amount12} ${precipitation_amount_unit}"
        echo "Weather Icon 1h: $icon1"
        echo "Weather Icon 6h: $icon6"
        echo "Weather Icon 12h: $icon12"
        echo "-----"
    fi
}

# default variables used to control flow of for loop
today="true"
current_date=""
five_days_later=$(date -d "+5 days" +%Y-%m-%d)
previous_date=""
output=""
nowTemperature=""
previousIcon=""
previousRainAmount="null"
numberOfWeatherHourSteps=7

# Initialize variables to store min/max temperature data
current_day=""
min_temp=""
max_temp=""

# units
precipitation_amount_unit=$(echo "$response" | jq -c '.properties.meta.units.precipitation_amount' | sed 's/"//g')
relative_humidity_unit=$(echo "$response" | jq -c '.properties.meta.units.relative_humidity' | sed 's/"//g')
wind_speed_unit=$(echo "$response" | jq -c '.properties.meta.units.wind_speed' | sed 's/"//g')

# Use jq to parse the JSON response and extract temperature data
for entry in $(echo "$response" | jq -c '.properties.timeseries[]'); do
    iso_date=$(echo "$entry" | jq -r '.time')
    
    # Convert ISO date to a human-readable format
    human_date=$(date -d "$iso_date" +"%A, %B %d, %Y")

    # Check if date is beyond 5 days after the current date
    if [[ "$iso_date" > "$five_days_later" ]]; then
        break
    fi

    # Get weather data, temperature data and current day of the week
    weather_data=$(echo "$entry" | jq -r '.data.instant.details')
    temperature=$(echo "$weather_data" | jq -r '.air_temperature')
    dayOfWeek=$(date +"%A" -d "${iso_date}")
    hourFromDate=$(date +"%Hh" -d "${iso_date}")
    hour=$(date -d "$iso_date" +%k)

    relative_humidity=$(echo "$weather_data" | jq -r '.relative_humidity')
    wind_speed=$(echo "$weather_data" | jq -r '.wind_speed')
    # Round to no decimals
    max_temp=$(printf '%.*f\n' 0 $max_temp)
    min_temp=$(printf '%.*f\n' 0 $min_temp)

    get_weather_icon_to_display

    get_rain_amount_to_display

    if [[ "$nowTemperature" == "" && $iconToDisplay ]]; then
        nowTemperature="${iconToDisplay} ${temperature}°C"
    fi

    # Check if a new day has started
    day=$(date -d "$iso_date" +"%Y-%m-%d")
    if [[ "$day" != "$current_day" ]]; then
        # Reset variables for the new day
        current_day="$day"
        min_temp="$temperature"
        max_temp="$temperature"
    fi

    # Update min and max temperatures
    if (( $(echo "$temperature < $min_temp" | bc -l) )); then
        min_temp="$temperature"
    fi
    if (( $(echo "$temperature > $max_temp" | bc -l) )); then
        max_temp="$temperature"
    fi

    # Check if there isn't left over numberOfWeatherHourSteps hours to show && Check if date changed to identify a new day
    if [ "$numberOfWeatherHourSteps" -le 0 ] && [ "$human_date" != "$previous_date" ] && [ $hour -gt 17 ]; then
        # formatted_date=$(date -d "$iso_date" +"%A, %B %d, %Y %I:%M %p")

        weather_info

        previous_date="$human_date"

        if [[ "$today" == 'true' ]]; then
            current_date="$human_date"
            today='false'
        fi
    fi

    # For the defined numberOfWeatherHourSteps, print every 2nd hour
    if [ "$numberOfWeatherHourSteps" -gt 0 ]; then
        if (( $hour % 2 == 0 )); then
            weather_info
            numberOfWeatherHourSteps=$((numberOfWeatherHourSteps - 1))
        fi
    fi
done

if [ "$debug" = "1" ]; then
    echo "NOW: $nowTemperature"
    exit 0
fi

if [ ! -n "$output" ]; then
    echo "No weather data to output."
    exit 1
fi

if [ "${output: -1}" = "," ]; then
    output="${output%,}"
fi

output="[$output]"

if [ "$Ags" == "1" ]; then
    ags run-js "ags.Service.Weather.setTooltip($output)"
    ags run-js "ags.Service.Weather.setTemperatureWeather(\"$nowTemperature\")"
else
    echo $output
fi
