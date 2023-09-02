#!/usr/bin/env bash

apiKey=""
defaultLocation=""
Ags=0
Debug=0
output=""
WindSpeedUnit="kph"
DegreeCharacter="°C"
HumidityUnit="%"
CloudCoverUnit="%"
RainUnit=" mm"

function debug_break() {
    echo "-----"
}

function get_script_argument_options() {
    if [[ $firstArg == "ags" ]]; then
        Ags=1
    fi

    if [[ $firstArg == "a" ]]; then
        Ags=1
    fi

    if [[ $firstArg == "debug" ]]; then
        Debug=1
    fi

    if [[ $firstArg == "d" ]]; then
        Debug=1
    fi
}

function get_config_file_data() {
    if [ -f "$ConfigFile" ]; then
        readarray -t line < "$ConfigFile"
        apiKey=${line[0]}
        defaultLocation=${line[1]}
    fi

    if [ "$Debug" = "1" ]; then
        echo "apiKey: $apiKey"
        echo "defaultLocation: $defaultLocation"
        debug_break
    fi

    if [[ "$apiKey" == "" || "$defaultLocation" == "" ]]; then
        echo "Wrong Config file."
        exit 1
    fi
}

function check_api_status() {
    check=$(echo "$data" | grep -c -e '"cod":"40')
    check2=$(echo "$data" | grep -c -e '"cod":"30')
    sum=$(( $check + $check2 ))
    if [ $sum -gt 0 ];then
        exit 99
    fi
}

function get_api_response() {
    if [ "$Debug" = "1" ]; then
        echo 'API REQUEST TO GET DATA'
    fi

    # Make the API request using curl
    response=$(curl -s "$URL")

    # Check if the request was successful
    if [ $? -ne 0 ]; then
        echo "Error making API request"
        exit 1
    fi

    # Save response to cache file
    echo "$response" > "$CacheFile"

    if [ "$Debug" = "1" ]; then
        echo $response
        debug_break
    fi

    check_api_status
}

function get_api_response_from_cache_file() {
    if [ "$Debug" = "1" ]; then
        echo 'DATA FROM CACHE'
    fi

    response=$(cat "$CacheFile")

    if [ "$Debug" = "1" ]; then
        echo $response
        debug_break
    fi

    check_api_status
}

function get_response() {
    # Check if cache file exists and is less than 5 minutes old
    if [ -f "$CacheFile" ] && [ $(($(date +%s) - $(date -r "$CacheFile" +%s))) -lt 300 ]; then
        get_api_response_from_cache_file
    else
        get_api_response
    fi
}

function print_weather_output() {
    if [ "$Debug" = "1" ]; then
        echo "NOW: $nowTemperature"
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
}

function get_debug_info_sunset_and_sunrise_hours() {
    if [ "$Debug" = "1" ]; then
        echo "Now: $CurrentTime"
        CurrentHour=$(date +"%-H" -d @$CurrentTime)
        echo "Current: $CurrentHour"

        echo "SunsetHour: $SunsetHour"
        echo "Sunrise: $SunriseHour"
        debug_break
    fi
}

#sunset information from the Current weather response
function get_current_sunset_and_sunrise_hours() {
    SunsetTime=$(echo $response | jq -r .sys.sunset)
    SunriseTime=$(echo $response | jq -r .sys.sunrise)
    SunsetHour=$(date +"%-H" -d @$SunsetTime)
    SunriseHour=$(date +"%-H" -d @$SunriseTime)

    #current time
    CurrentTime=$(date +%s)

    get_debug_info_sunset_and_sunrise_hours
}

#sunset information from the weather Forecast response
function get_forecast_sunset_and_sunrise_hours() {
    SunsetTime=$(echo $response | jq -r .city.sunset)
    SunriseTime=$(echo $response | jq -r .city.sunrise)
    SunsetHour=$(date +"%-H" -d @$SunsetTime)
    SunriseHour=$(date +"%-H" -d @$SunriseTime)

    #current time
    CurrentTime=$(date +%s)

    get_debug_info_sunset_and_sunrise_hours
}

#Updates provided weather icon with night icons and sunset/sunrise icons
function get_weather_icon() {
    icon=$1

    dontCheck=0

    if [[ $WeatherHour -eq $SunriseHour ]]; then
        dontCheck=1
        icon="🌄"
    fi

    if [[ "$dontCheck" == 0 && $WeatherHour -eq $SunsetHour ]]; then
        dontCheck=1
        icon="🌇"
    fi

    if [[ "$dontCheck" == 0 && $WeatherHour -ge $SunsetHour || $WeatherHour -le $SunriseHour ]]; then
        case $1 in
            "☀️") icon="🌑" ;;
            "🌤") icon="🌑" ;;
            "⛅") icon="" ;;
            "☁") icon="" ;;
            "🌦") icon="" ;;
            "🌧️") icon="" ;;
            "🌨") icon="" ;;
            "") icon="" ;;
        esac

        if [[ "$icon" == "🌑" ]]; then
            # Generate a random number between 1 and 5
            random_number=$(( RANDOM % 5 + 1 ))

            # Check the random number and provide different outputs
            if [ $random_number -eq 1 ]; then
                icon="🌕"
            fi
        fi
    fi
}

function get_min_and_max_weather() {
    # MinTemperature=$(echo $response | jq -r .list[$i].main.temp_min | tr '\n' ' ')
    # MaxTemperature=$(echo $response | jq -r .list[$i].main.temp_max | tr '\n' ' ')

    # Check if a new day has started
    Day=$(date +"%Y-%m-%d" -d @${WeatherDate})
    if [[ "$Day" != "$CurrentDay" ]]; then
        # Reset variables for the new day
        CurrentDay="$Day"
        MinTemperature="$Temperature"
        MaxTemperature="$Temperature"
    fi

    # Update min and max temperatures
    if (( $(echo "$Temperature < $MinTemperature" | bc -l) )); then
        MinTemperature="$Temperature"
    fi

    if (( $(echo "$Temperature > $MaxTemperature" | bc -l) )); then
        MaxTemperature="$Temperature"
    fi

    MinTemp=$(printf '%.*f\n' 0 $MinTemperature)
    MaxTemp=$(printf '%.*f\n' 0 $MaxTemperature)
}

function clear_defaults() {
    WeatherDate=""
    WeatherHour=""
    FormattedDate=""
    Temperature=""
    Temperature=""
    ShortWeather=""
    LongWeather=""
    Humidity=""
    CloudCover=""
    WindSpeed=""
    MinTemperature=""
    MaxTemperature=""
    MinTemp=""
    MaxTemp=""
    icons=""
    Rain1h="null"
    Rain3h="null"
}

function weather_data() {
    forecast=$1

    if [ "$forecast" = "f" ]; then
        FormattedDate=$(date -d @${WeatherDate} +"%A, %B %d, %Y")
        # ShortWeather=$(echo $response | jq -r .list[$i].weather[] | jq -r .main | tr '\n' ' '| awk '{$1=$1};1' )
        LongWeather=$(echo $response | jq -r .list[$i].weather[] | jq -r .description | sed -E 's/\S+/\u&/g' | tr '\n' ' '| awk '{$1=$1};1' )
        Humidity=$(echo $response | jq -r .list[$i].main.humidity | tr '\n' ' '| awk '{$1=$1};1' )
        CloudCover=$(echo $response | jq -r .list[$i].clouds.all | tr '\n' ' '| awk '{$1=$1};1' )
        WindSpeed=$(echo $response | jq -r .list[$i].wind.speed | tr '\n' ' ' | awk '{$1=$1};1' )
        WindSpeed=$(printf '%.*f\n' 1 $WindSpeed)

        Rain1h=$(echo $response | jq -r .list[$i] | jq -r '.rain."1h"')
        Rain3h=$(echo $response | jq -r .list[$i] | jq -r '.rain."3h"')

        icons=$(echo $response | jq -r .list[$i].weather[] | jq -r .icon | tr '\n' ' ' )
    else
        #current weather
        WeatherDate=$(echo $response | jq -r  .dt  | tr '\n' ' ')
        WeatherHour=$(date +"%-H" -d @${WeatherDate})
        FormattedDate=$(date -d @${WeatherDate} +"%A, %B %d, %Y")

        Temperature=$(echo $response | jq -r .main.temp | tr '\n' ' ')
        Temperature=$(printf '%.*f\n' 0 $Temperature)
        # ShortWeather=$(echo $response | jq -r .weather[0].main | tr '\n' ' '| awk '{$1=$1};1' )
        LongWeather=$(echo $response | jq -r .weather[0].description | sed -E 's/\S+/\u&/g' | tr '\n' ' '| awk '{$1=$1};1' )

        Humidity=$(echo $response | jq -r .main.humidity | tr '\n' ' '| awk '{$1=$1};1' )
        CloudCover=$(echo $response | jq -r .clouds.all | tr '\n' ' '| awk '{$1=$1};1' )
        WindSpeed=$(echo $response | jq -r .wind.speed | tr '\n' ' ' | awk '{$1=$1};1' )
        WindSpeed=$(printf '%.*f\n' 1 $WindSpeed)

        Rain1h=$(echo $response | jq -r '.rain."1h"')
        Rain3h=$(echo $response | jq -r '.rain."3h"')

        MinTemperature=$(echo $response | jq -r .main.temp_min | tr '\n' ' ')
        MaxTemperature=$(echo $response | jq -r .main.temp_max | tr '\n' ' ')
        MinTemp=$(printf '%.*f\n' 0 $MinTemperature)
        MaxTemp=$(printf '%.*f\n' 0 $MaxTemperature)

        icons=$(echo $response | jq -r .weather[0].icon | tr '\n' ' ')
    fi

    Rain="0"

    if [[ "$Rain3h" != "null" ]]; then
        Rain="$Rain3h"
    fi

    if [[ "$Rain1h" != "null" ]]; then
        Rain="$Rain1h"
    fi

    iconval=${icons%?}
    case $iconval in
        01*) get_weather_icon "☀️";;
        02*) get_weather_icon "🌤";;
        03*) get_weather_icon "⛅";;
        04*) get_weather_icon "☁";;
        09*) get_weather_icon "🌦";;
        10*) get_weather_icon "🌧️";;
        11*) get_weather_icon "🌩";;
        13*) get_weather_icon "🌨";;
        50*) get_weather_icon "";;
    esac

    if [ "$Debug" = "1" ]; then
        echo "WeatherDate: $FormattedDate, Hour: $WeatherHour"
        # echo "ShortWeather: $ShortWeather"
        echo "LongWeather: $LongWeather"
        echo "Humidity: $Humidity$HumidityUnit"
        echo "CloudCover: $CloudCover$CloudCoverUnit"
        echo "WindSpeed: $WindSpeed $WindSpeedUnit"
        echo "Temperature: $Temperature$DegreeCharacter"
        echo "icon: $icon"
        echo "MinTemp: $MinTemp$DegreeCharacter"
        echo "MaxTemp: $MaxTemp$DegreeCharacter"
        echo "rain_1h: $Rain1h"
        echo "rain_3h: $Rain3h"
        debug_break
    fi

    if [ "$forecast" != "f" ]; then
        nowTemperature="$icon $Temperature$DegreeCharacter"
    fi

    output+="{\"date\":\"$FormattedDate\",\"hour\":\"$WeatherHour\",\"temperature\":\"${Temperature}°C\",\"icon\":\"$icon\",\"wind\":\"$WindSpeed$WindSpeedUnit\",\"rain\":\"$Rain$RainUnit\",\"humidity\":\"$Humidity$HumidityUnit\",\"minTemp\":\"$MinTemp$DegreeCharacter\",\"maxTemp\":\"$MaxTemp$DegreeCharacter\"},"
}

function get_weather_forecast_data() {
    CurrentDay=""
    TomorrowDate=$(date -d '+1 day' +"%s")

    clear_defaults

    let i=0
    # NumEntries=$(echo $response |jq -r .cnt)
    # while [ $i -lt $NumEntries ]; do
    while [ $i -lt 40 ]; do
        WeatherDate=$(echo $response | jq -r  .list[$i].dt  | tr '\n' ' ')
        WeatherHour=$(date +"%-H" -d @${WeatherDate})
        CastDate=$(date +"%s" -d @${WeatherDate})

        Temperature=$(echo $response | jq -r .list[$i].main.temp | tr '\n' ' ')
        Temperature=$(printf '%.*f\n' 0 $Temperature)

        get_min_and_max_weather

        #show the weather forecast hourly until it reaches tomorrow date, then only 1 hour
        if [ $CastDate -le $TomorrowDate ]; then
            weather_data "f"
        else
            if [ "$WeatherHour" -ge "17" ] && [ "$WeatherHour" -le "18" ]; then
                weather_data "f"
            fi
        fi

        i=$((i + 1))
    done
}

function call_weather_current_api() {
    # API endpoint URL Current Weather
    URL="http://api.openweathermap.org/data/2.5/weather?q=$defaultLocation&units=metric&appid=$apiKey"

    # Current Weather API cache file path based on defaultLocation
    CacheFile="/tmp/weather_cache_${defaultLocation}_current.json"

    get_response
    # get_api_response_from_cache_file

    get_current_sunset_and_sunrise_hours
    weather_data "c"
}

function call_weather_forecast_api() {
    # API endpoint URL Forecast
    URL="http://api.openweathermap.org/data/2.5/forecast?id=$defaultLocation&units=metric&appid=$apiKey"

    # Forecast API cache file path based on defaultLocation
    CacheFile="/tmp/weather_cache_${defaultLocation}_forecast.json"

    get_response
    # get_api_response_from_cache_file

    #used to retrieve forecast data
    get_forecast_sunset_and_sunrise_hours
    get_weather_forecast_data
}

#get this scripts arguments => (ags, debug or none)
firstArg="$(echo "$1")"
get_script_argument_options

#call to get config file data => (apiKey and defaultLocation)
ConfigFile="$HOME/.config/scripts/weather.rc"
get_config_file_data

call_weather_current_api

call_weather_forecast_api

#prints out final output / sends over the data
print_weather_output
