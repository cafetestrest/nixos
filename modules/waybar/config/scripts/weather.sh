#!/usr/bin/env bash

# TODO: Add in sunrise/sunset calcuations

apiKey=""
defaultLocation=""
Conky="True"
OpenBox="False"
Terminal="False"
HTML="False"
degreeCharacter="c"
data=0
lastUpdateTime=0
FeelsLike=0
dynamicUpdates=0
UseIcons="True"
colors="False"
CityID="True"

ConfigFile="$HOME/.config/waybar/scripts/weather_sh.rc"

if [ "$1" == "-r" ];then
    shift
    ConfigFile="$1"
    shift
fi

if [ -f "$ConfigFile" ];then
    readarray -t line < "$ConfigFile"
    apiKey=${line[0]}
    defaultLocation=${line[1]}
    degreeCharacter=${line[2]}
    UseIcons=${line[3]}
    temp=${line[4]}
    if [ "$temp" = "True" ];then
        if [ -f "$HOME/.bashcolors" ];then
            source "$HOME/.bashcolors"
            colors="True"
        else
            colors=""
        fi
    else
        colors=""
    fi
fi

while [ $# -gt 0 ]; do
option="$1"
    case $option
    in
    -k) apiKey="$2"
    shift
    shift ;;
    -l) defaultLocation="$2"
    shift
    shift ;;
    -d) dynamicUpdates=1
    shift ;;
    -t) Terminal="True"
    shift ;;
    -h) HTML="True"
    shift ;;
    -o) OpenBox="True"
    shift ;;    
    -y) Conky="True"
    shift ;;    
    -f) degreeCharacter="f"
    shift ;;
    -p) CachePath="$2"
    shift
    shift ;;
    -n) UseIcons="False"
    shift ;;
    -c) 
        if [ -f "$HOME/.bashcolors" ];then
            source "$HOME/.bashcolors"
            colors="True"
        fi
    shift ;;
    esac
done

if [ -z "${CachePath}" ];then 
    dataPath="/tmp/wth-$defaultLocation.json"
else
    dataPath="${CachePath}/wth-$defaultLocation.json"
fi

if [ -z $apiKey ];then
    echo "No API Key specified in rc, script, or command line."
    exit
fi

#Is it City ID or a string?
case $defaultLocation in
    ''|*[!0-9]*) CityID="False" ;;
    *) CityID="True" ;;
esac

if [ ! -e $dataPath ];
then
    touch $dataPath
    #The API call is different if city ID is used instead of string lookup
    if [ "$CityID" = "True" ];then
        data=$(curl "http://api.openweathermap.org/data/2.5/weather?id=$defaultLocation&units=metric&appid=$apiKey" -s )
    else
        data=$(curl "http://api.openweathermap.org/data/2.5/weather?q=$defaultLocation&units=metric&appid=$apiKey" -s )
    fi
    echo $data > $dataPath
else
    data=$(cat $dataPath)
fi
lastUpdateTime=$(($(date +%s) -600))

# echo $data
# echo data
# exit 1

while true; do
    lastfileupdate=$(date -r $dataPath +%s)
    if [ $(($(date +%s)-$lastfileupdate)) -ge 600 ];then
        if [ "$CityID" = "True" ];then
            data=$(curl "http://api.openweathermap.org/data/2.5/weather?id=$defaultLocation&units=metric&appid=$apiKey" -s )
        else
            data=$(curl "http://api.openweathermap.org/data/2.5/weather?q=$defaultLocation&units=metric&appid=$apiKey" -s )
        fi
        echo $data > $dataPath
    else
        if [ "$Conky" != "True" ];then 
            echo "Cache age: $(($(date +%s)-$lastfileupdate)) seconds."
        fi
    fi

    check=$(echo "$data" | grep -c -e '"cod":"40')
    check2=$(echo "$data" | grep -c -e '"cod":"30')
    sum=$(( $check + $check2 ))
    if [ $sum -gt 0 ];then
        exit 99
    fi
    if [ $(($(date +%s)-$lastUpdateTime)) -ge 600 ]; then
        lastUpdateTime=$(date +%s)
        Station=$(echo $data | jq -r .name)
        Lat=$(echo $data | jq -r .coord.lat)
        Long=$(echo $data | jq -r .coord.lon)
        Country=$(echo $data | jq -r .sys.country)

        SunsetTime=$(echo $data | jq -r .sys.sunset)
        SunriseTime=$(echo $data | jq -r .sys.sunrise)
        CurrentTime=$(date +%s)

        function get_weather_icon() {
            if [[ $CurrentTime -ge $SunsetTime || $CurrentTime -le $SunriseTime ]]; then
                icon="☾"
            else
                icon=$1
            fi
        }

        ####################################################################
        # Current conditions (and icon)
        ####################################################################
        if [ "$UseIcons" = "True" ];then
            icons=$(echo $data | jq -r .weather[].icon | tr '\n' ' ')
            iconval=${icons%?}
            case $iconval in
                # 01d) icon="☼";; # looks like a snowflake
                # 01d) icon="☀️";;
                # 01n) icon="☾";;
                # 02d) icon="⛅";;
                # 02n) icon="☁";;
                # 03d) icon="☁";;
                # 03n) icon="☁";;
                # 04d) icon="☁";;
                # 04n) icon="☁";;
                # 09d) icon="☔";;
                # 09n) icon="☔";;
                # 10d) icon="☂";;
                # 10n) icon="☂";;
                # 11d) icon="⚡";;
                # 11n) icon="⚡";;
                # 13d) icon="❄";;
                # 13n) icon="❄";;
                # 50d) icon="⛆";;
                # 50n) icon="⛆";;
                01*) get_weather_icon "☀️";;
                02*) get_weather_icon "🌤";;
                03*) get_weather_icon "🌥";;
                04*) get_weather_icon "☁";;
                09*) get_weather_icon "🌧";;
                10*) get_weather_icon "🌦";;
                11*) get_weather_icon "🌩";;
                13*) get_weather_icon "🌨";;
                50*) get_weather_icon "🌫";;
            esac
        else
            icon=""
        fi
        ShortWeather=$(echo $data | jq -r .weather[].main | tr '\n' ' '| awk '{$1=$1};1' )
        LongWeather=$(echo $data | jq -r .weather[].description | sed -E 's/\S+/\u&/g' | tr '\n' ' '| awk '{$1=$1};1' )

        ####################################################################
        # Temperature
        ####################################################################
        tempinc=$(echo $data | jq -r .main.temp| awk '{$1=$1};1' )   
        RawTemp=$(echo $data | jq -r .main.temp| awk '{$1=$1};1' )
        temperature=$tempinc
        if  [ "$degreeCharacter" = "f" ]; then
            temperature=$(echo "scale=2; 32+1.8*$tempinc" | bc| awk '{$1=$1};1' )
        fi

        ####################################################################
        # Parse Wind Info
        ####################################################################
        wind=$(echo $data | jq .wind.deg)
        winddir=$((2193-(${wind%.*}+45)/90))
        if [ $winddir -eq 2192 ]; then
            winddir=2190
        elif [ $winddir -eq 2190 ];then
            winddir=2192
        else
            :
        fi
        RawWindSpeed=$(echo $data | jq .wind.speed)
        WindSpeed=$(echo $data | jq .wind.speed)
        WindGusts=$(echo $data | jq .wind.gust)
        
        #Conversion
        if  [ "$degreeCharacter" = "f" ]; then
            WindSpeed=$(echo "scale=2; $WindSpeed*0.6213712" | bc | xargs printf "%.2f"| awk '{$1=$1};1' )
            WindGusts=$(echo "scale=2; $WindGusts*0.6213712" | bc | xargs printf "%.2f"| awk '{$1=$1};1' )
            windunit="mph"
        else
            WindGusts=$(echo "scale=2; $WindGusts*1" | bc| awk '{$1=$1};1' )
            windunit="kph"
        fi        

        Humidity=$(echo $data | jq .main.humidity| awk '{$1=$1};1' )
        CloudCover=$(echo $data | jq .clouds.all| awk '{$1=$1};1' )

        ####################################################################
        # Feels Like Calculations
        # Using the raw metric value for criteria, then converting later
        ####################################################################
        # Wind Chill
        ####################################################################
        if (( $(bc -l<<<"$RawWindSpeed > 4.5") )); then #windspeed criteria for windchill
            if (( $(bc -l<<<"$RawTemp< 11") )); then #temp criteria for windchill
                FeelsLike=1
                if [ "degreeCharacter" = "f" ];then
                    WindSpeedExp=$(echo "e(0.16*l($WindSpeed))" | bc -l )
                    FeelsLikeTemp=$(echo "scale=2; 35.74 + 0.6215*$temperature - 35.75*$WindSpeedExp + 0.4275*$temperature*$WindSpeedExp" | bc | xargs printf "%.2f"| awk '{$1=$1};1' )
                else
                    WindSpeedExp=$(echo "e(0.16*l($WindSpeed))" | bc -l )
                    FeelsLikeTemp=$(echo "scale=2; 13.12 + 0.6215*$temperature - 11.37*$WindSpeedExp + 0.3965*$temperature*$WindSpeedExp" | bc | xargs printf "%.2f"| awk '{$1=$1};1' )
                fi
            fi
        fi

        ####################################################################
        # Heat Index
        # I can only find Farenheit calcuations, so....
        ####################################################################
        if  [ "$degreeCharacter" = "c" ]; then
            HITemp=$(echo "scale=2; 32+1.8*$tempinc" | bc)
        else
            HITemp=$RawTemp
        fi
        if (( $(bc -l<<<"$HITemp> 79") )); then #temp criteria for heat index
            FeelsLike=1
            FeelsLikeTemp=$(echo "scale=2;0.5 * ($HITemp + 61.0 + (($HITemp-68.0)*1.2) + ($Humidity*0.094))" | bc| awk '{$1=$1};1' )
            if [ "$degreeCharacter" = "c" ];then
                FeelsLikeTemp=$(echo "scale=2; ($FeelsLikeTemp-32) / 1.8" | bc| awk '{$1=$1};1' )

            fi
        fi

        ####################################################################
        # Pressure Data
        ####################################################################
        pressure=$(echo $data | jq .main.pressure)
        if  [ "$degreeCharacter" = "f" ]; then
            pressure=$(echo "scale=2; $pressure/33.863886666667" | bc | awk '{$1=$1};1' )
            pressureunit="in"
        else
            pressureunit="hPa"
        fi
    fi
    AsOf=$(date +"%Y-%m-%d %R" -d @$lastfileupdate) 
    if [ "$OpenBox" = "False" ];then
        if [ "$HTML" = "False" ];then
            if [ "$Conky" = "False" ];then
                Terminal="True"
            fi
        fi
    fi
    if [ "$Terminal" = "True" ];then
    # if [ "$Terminal" = "True" ];then
        if [ "$colors" = "True" ]; then
            echo "Station: $Station, $Country $Lat / $Long"
            echo "As Of: ${YELLOW}$AsOf ${RESTORE}"  
            echo "Right Now: ${CYAN}$icon $LongWeather${RESTORE}"
            #echo "$icon $ShortWeather"
            echo "Temp: ${CYAN}$temperature°${degreeCharacter^^}${RESTORE}"
            if [ "$FeelsLike" = "1" ];then
                echo "Feels Like: ${RED}$FeelsLikeTemp°${degreeCharacter^^}${RESTORE}"
            fi
            echo "Pressure: ${GREEN}$pressure$pressureunit${RESTORE}"
            if [ "$UseIcons" = "True" ];then
                echo -e \\u$winddir "${MAGENTA}$WindSpeed$windunit${RESTORE} Gusts: ${MAGENTA}$WindGusts$windunit${RESTORE}"
            else
                echo "Wind: ${MAGENTA}$WindSpeed$windunit${RESTORE} Gusts: ${MAGENTA}$WindGusts$windunit${RESTORE}"
            fi
            echo "Humidity: ${GREEN}$Humidity%${RESTORE}"
            echo "Cloud Cover: ${GREEN}$CloudCover%${RESTORE}"        
        else
            echo "Station: $Station, $Country $Lat / $Long"
            echo "As Of: $AsOf "  
            echo "Right Now: $icon $LongWeather"
            #echo "$icon $ShortWeather"
            echo "Temp: $temperature°${degreeCharacter^^}"
            if [ "$FeelsLike" = "1" ];then
                echo "Feels Like: $FeelsLikeTemp°${degreeCharacter^^}"
            fi
            echo "Pressure: $pressure$pressureunit"
            echo -e \\u$winddir "$WindSpeed$windunit Gusts: $WindGusts$windunit"
            echo "Humidity: $Humidity%"
            echo "Cloud Cover: $CloudCover%"
        fi
    fi
    if [ "$Conky" = "True" ]; then

        if [ "$colors" = "True" ]; then
            bob=$(echo "$ShortWeather $temperature°${degreeCharacter^^}")
            if [ "$FeelsLike" = "1" ];then
                bob=$(echo "$bob/$FeelsLikeTemp°${degreeCharacter^^}")
            fi
        else
            bob=$(echo "$ShortWeather $temperature°${degreeCharacter^^}")
            if [ "$FeelsLike" = "1" ];then
                bob=$(echo "$bob/$FeelsLikeTemp°${degreeCharacter^^}")
            fi

        fi
        # echo "$bob"
    fi

    if [ "$OpenBox" = "True" ]; then
        echo '<openbox_pipe_menu>' 
        echo '<separator label="Weather" />' 
        printf '<item label="Station: %s, %s" />\n' "$Station" "$Country"  
        printf '<item label="As of %s" />\n' "$AsOf" 
        printf '<item label="Now: %s %s" />\n' "$icon" "$LongWeather" 
        printf '<item label="Temp: %s%s" />\n' "$temperature" "°${degreeCharacter^^}" 
        if [ "$FeelsLike" = "1" ];then
            printf '<item label="Feels Like: %s%s" />\n' "$FeelsLikeTemp" "°${degreeCharacter^^}" 
        fi
        printf '<item label="Pressure: %s%s" />\n' "$pressure" "$pressureunit" 
        printf '<item label="Wind: %s%s Gusts: %s%s" />\n'  "$WindSpeed" "$windunit" "$WindGusts" "$windunit" 
        printf '<item label="Humidity: %s%%" />\n' "$Humidity" 
        printf '<item label="Cloud Cover: %s%%" />\n' "$CloudCover" 
        echo '</openbox_pipe_menu>' 
    fi
    if [ "$HTML" = "True" ];then
        echo "Station: $Station, $Country $Lat / $Long <br  />"  
        echo "As Of: $AsOf <br  />"  
        echo "Current Conditions: $icon $LongWeather <br  />" 
        #echo "$icon $ShortWeather" 
        echo "Temp: $temperature °${degreeCharacter^^} <br  />" 
        if [ "$FeelsLike" = "1" ];then
            echo "Feels Like: $FeelsLikeTemp °${degreeCharacter^^} <br  />"
        fi
        echo "Pressure: $pressure $pressureunit <br  />" 
        echo -e \\u$winddir "$WindSpeed$windunit Gusts: $WindGusts$windunit <br  />" 
        echo "Humidity: $Humidity% <br  />" 
        echo "Cloud Cover: $CloudCover% <br  />"     
    fi
    if [ $dynamicUpdates -eq 0 ];then
        break
    fi    


done
# echo "$temperature°${degreeCharacter^^} $icon"

txt1=$(echo "Station: $Station, $Country $Lat / $Long")
txt2=$(echo "As Of: ${YELLOW}$AsOf ${RESTORE}")
txt3=$(echo "Right Now: ${CYAN}$icon $LongWeather${RESTORE}")
txt4=$(echo "Temp: ${CYAN}$temperature°${degreeCharacter^^}${RESTORE}")
# txt5=$(echo "Feels Like: ${RED}$FeelsLikeTemp°${degreeCharacter^^}${RESTORE}")
txt6=$(echo "Pressure: ${GREEN}$pressure$pressureunit${RESTORE}")
# if [ "$UseIcons" = "True" ];then
# else
# echo "Wind: ${MAGENTA}$WindSpeed$windunit${RESTORE} Gusts: ${MAGENTA}$WindGusts$windunit${RESTORE}321"
# fi
txt7=$(echo -e \\u$winddir "${MAGENTA}$WindSpeed$windunit${RESTORE} Gusts: ${MAGENTA}$WindGusts$windunit${RESTORE}")
txt8=$(echo "Humidity: ${GREEN}$Humidity%${RESTORE}")
txt9=$(echo "Cloud Cover: ${GREEN}$CloudCover%${RESTORE}")

#round to only 1 decimal - custom
if ! [[ "$temperature" =~ ^(-)?[0-9]+$ ]]
then
    bobTemperature=$(printf "%.1f" $temperature)

    #check if digit ends with .0, if so remove .0 to display round digit
    if [[ $bobTemperature == *.0 ]]
    then
        bobTemperature=${bobTemperature::-2}
    fi
else
    bobTemperature=$temperature
fi

# longbob=$(echo "$icon $LongWeather $bobTemperature°${degreeCharacter^^}")
longbob=$(echo "$icon $bobTemperature°${degreeCharacter^^}")

tooltip() {
    if [ -z "${CachePath}" ];then 
        dataPath="/tmp/fore2-$defaultLocation.json"
    else
        dataPath="${CachePath}/fore2-$defaultLocation.json"
    fi

    if [ ! -e $dataPath ];then
        touch $dataPath
        if [ "$CityID" = "True" ];then
            data=$(curl -s "http://api.openweathermap.org/data/2.5/forecast?id=$defaultLocation&units=metric&appid=$apiKey")
        else
            data=$(curl -s "http://api.openweathermap.org/data/2.5/forecast?q=$defaultLocation&units=metric&appid=$apiKey")
        fi

        echo $data > $dataPath
    else
        data=$(cat $dataPath)
    fi

        check=$(echo "$data" | grep -c -e '"cod":"40')
        check2=$(echo "$data" | grep -c -e '"cod":"30')
        sum=$(( $check + $check2 ))
        if [ $sum -gt 0 ];then
            exit 99
        fi

    lastUpdateTime=$(($(date +%s) -600))

    while true; do
        lastfileupdate=$(date -r $dataPath +%s)
        if [ $(($(date +%s)-$lastfileupdate)) -ge 600 ];then
            if [ "$CityID" = "True" ];then
                data=$(curl -s "http://api.openweathermap.org/data/2.5/forecast?id=$defaultLocation&units=metric&appid=$apiKey")
            else
                data=$(curl -s "http://api.openweathermap.org/data/2.5/forecast?q=$defaultLocation&units=metric&appid=$apiKey")
            fi
            echo $data > $dataPath
        # else
        #     if [ "$Conky" != "True" ];then 
        #         echo "Cache age: $(($(date +%s)-$lastfileupdate)) seconds."
        #     fi
        fi

        if [ $(($(date +%s)-$lastUpdateTime)) -ge 600 ]; then
            lastUpdateTime=$(date +%s)
            

            ########################################################################
            # Location Data
            ########################################################################
            Station=$(echo $data | jq -r .city.name)
            #Lat=$(echo $data | jq -r .coord.lat)
            #Long=$(echo $data | jq -r .coord.lon)
            #Country=$(echo $data | jq -r .sys.country)
            NumEntries=$(echo $data |jq -r .cnt)
            let i=0
        
            while [ $i -lt $NumEntries ]; do 
                # Get the date...unix format
                NixDate[$i]=$(echo $data | jq -r  .list[$i].dt  | tr '\n' ' ')
                ####################################################################
                # Current conditions (and icon)
                ####################################################################
                if [ "$UseIcons" = "True" ];then
                    icons[$i]=$(echo $data | jq -r .list[$i].weather[] | jq -r .icon | tr '\n' ' ')
                    iconval=${icons[$i]%?}
                    case $iconval in
                        01*) icon[$i]="☀️";;
                        02*) icon[$i]="🌤";;
                        03*) icon[$i]="🌥";;
                        04*) icon[$i]="☁";;
                        09*) icon[$i]="🌧";;
                        10*) icon[$i]="🌦";;
                        11*) icon[$i]="🌩";;
                        13*) icon[$i]="🌨";;
                        50*) icon[$i]="🌫";;
                    esac
                else
                    icon[$i]=""
                fi
                ShortWeather[$i]=$(echo $data | jq -r .list[$i].weather[] | jq -r .main | tr '\n' ' '| awk '{$1=$1};1' )
                LongWeather[$i]=$(echo $data | jq -r .list[$i].weather[] | jq -r .description | sed -E 's/\S+/\u&/g' | tr '\n' ' '| awk '{$1=$1};1' )
                Humidity[$i]=$(echo $data | jq -r .list[$i].main.humidity | tr '\n' ' '| awk '{$1=$1};1' )
                CloudCover[$i]=$(echo $data | jq -r .list[$i].clouds.all | tr '\n' ' '| awk '{$1=$1};1' )

                ####################################################################
                # Parse Wind Info
                ####################################################################
                WindSpeed[$i]=$(echo $data | jq -r .list[$i].wind.speed | tr '\n' ' ' | awk '{$1=$1};1' )

                #Conversion
                if  [ "$degreeCharacter" = "f" ]; then
                    WindSpeed[$i]=$(echo "scale=2; ${WindSpeed[$i]}*0.6213712" | bc | xargs printf "%.2f" | awk '{$1=$1};1' )
                    windunit="mph"
                else
                    windunit="kph"
                fi        

                ####################################################################
                # Temperature
                ####################################################################
                # temperature in F will be broken ATM
                # tempinc[$i]=$(echo $data | jq -r .list[$i].main.temp | tr '\n' ' ')
                # temperature[$i]=$tempinc[$i]
                # if  [ "$degreeCharacter" = "f" ]; then
                #     temperature[$i]=$(echo "scale=2; 32+1.8*${tempinc[$i]}" | bc)
                # fi
                tempTemperature=$(echo $data | jq -r .list[$i].main.temp | tr '\n' ' ')

                #round to only 1 decimal - custom
                if ! [[ "$tempTemperature" =~ ^(-)?[0-9]+$ ]]
                then
                    tempTemperature2=$(printf "%.1f" $tempTemperature)

                    #check if digit ends with .0, if so remove .0 to display round digit
                    if [[ $tempTemperature2 == *.0 ]]
                    then
                        tempTemperature2=${tempTemperature2::-2}
                    fi
                else
                    tempTemperature2=$tempTemperature
                fi

                temperature[$i]=$tempTemperature2

                i=$((i + 1))
            done
        fi


        AsOf=$(date +"%Y-%m-%d %R" -d @$lastfileupdate) 
        TomorrowDate=$(date -d '+1 day' +"%s")
        NowHour=$(date +"%-H")
        NowLow=$((NowHour + 1))
        NowHigh=$((NowHour - 1))
        if [ "$OpenBox" = "False" ];then
            if [ "$HTML" = "False" ];then
                if [ "$Conky" = "False" ];then
                    Terminal="True"
                fi
            fi
        fi
    
        previousDayFromDate='-1';

        if [ "$Conky" = "True" ];then
            # if [ "$colors" = "True" ]; then
            #     echo "Forecast for $Station as of: ${YELLOW}$AsOf${RESTORE} "
            # else
            #     echo "Forecast for $Station as of: $AsOf "  
            # fi
            let i=0
            while [ $i -lt 40 ]; do

                CastDate=$(date +"%s" -d @${NixDate[$i]})
                if [ $CastDate -le $TomorrowDate ]; then
                    ShortDate=$(date +"%m/%d@%R" -d @${NixDate[$i]})
                    hourFromDate=$(date +"%Hh" -d @${NixDate[$i]})
                    dayAndMonth=$(date +"%A %e %B" -d @${NixDate[$i]})

                    if [ "$previousDayFromDate" != "$dayAndMonth" ]; then
                        if [ $i -eq 0 ]; then
                            weatherDataToPrint+="$dayAndMonth\n"
                        else
                            weatherDataToPrint+="\n$dayAndMonth\n"
                        fi
                    fi

                    if [ "$colors" = "True" ]; then
                        weatherDataToPrint+=$(printf "${YELLOW}%-11s${RESTORE}: ${CYAN}%-2s%-16s${RESTORE} Temp:${CYAN}%-6s${RESTORE} Wind:${MAGENTA}%-6s${RESTORE} Humidity:${GREEN}%-4s${RESTORE} Clouds:${GREEN}%-4s${RESTORE}\n" "$hourFromDate" "${icon[$i]} " "${LongWeather[$i]}" "${temperature[$i]}°${degreeCharacter^^}" "${WindSpeed[$i]}$windunit" "${Humidity[$i]}%" "${CloudCover[$i]}%")
                    else
                        weatherDataToPrint+=$(printf "%-5s %-2s%-6s %-14s %-14s %-14s %-1s\n" "$hourFromDate:" "${temperature[$i]}°${degreeCharacter^^} " "${icon[$i]}" "${LongWeather[$i]}" "Wind:${WindSpeed[$i]}$windunit" "Humidity:${Humidity[$i]}%" "Cloud Cover:${CloudCover[$i]}%\n")
                    fi
                else
                    CastHour=$(date +"%-H" -d @${NixDate[$i]})
                    if [ "$CastHour" -ge "$NowHigh" ] && [ "$CastHour" -le "$NowLow" ]; then
                        ShortDate=$(date +"%m/%d@%R" -d @${NixDate[$i]})
                        hourFromDate=$(date +"%Hh" -d @${NixDate[$i]})
                        dayAndMonth=$(date +"%A %e %B" -d @${NixDate[$i]})

                        if [ "$previousDayFromDate" != "$dayAndMonth" ]; then
                            if [ $i -eq 0 ]; then
                                weatherDataToPrint+="$dayAndMonth\n"
                            else
                                weatherDataToPrint+="\n$dayAndMonth\n"
                            fi
                        fi

                        if [ "$colors" = "True" ]; then
                            weatherDataToPrint+=$(printf "${RED}%-11s${RESTORE}: ${CYAN}%-2s%-16s${RESTORE} Temp:${CYAN}%-6s${RESTORE} Wind:${MAGENTA}%-6s${RESTORE} Humidity:${GREEN}%-4s${RESTORE} Clouds:${GREEN}%-4s${RESTORE}\n" "$hourFromDate" "${icon[$i]} " "${LongWeather[$i]}" "${temperature[$i]}°${degreeCharacter^^}" "${WindSpeed[$i]}$windunit" "${Humidity[$i]}%" "${CloudCover[$i]}%")
                        else
                            weatherDataToPrint+=$(printf "%-5s %-2s%-6s %-14s %-14s %-14s %-1s\n" "$hourFromDate:" "${temperature[$i]}°${degreeCharacter^^} " "${icon[$i]}" "${LongWeather[$i]}" "Wind:${WindSpeed[$i]}$windunit" "Humidity:${Humidity[$i]}%" "Cloud Cover:${CloudCover[$i]}%\n")
                        fi
                    fi
                fi            

                # echo "previousDayFromDate: $previousDayFromDate"
                # echo "dayAndMonth: $dayAndMonth"
                # echo "ShortDate: $ShortDate"
                # echo "CastDate: $CastDate"

                if [ $i -eq 0 ]; then
                    firstWeatherDataToPrint=$weatherDataToPrint
                fi

                previousDayFromDate=$dayAndMonth

                i=$((i + 1))
            done
            fi

        if [ $dynamicUpdates -eq 0 ];then
            break
        fi    
    done

    # echo $weatherDataToPrint
    # echo "{\"text\":\"test weather data\", \"tooltip\":\"$weatherDataToPrint\"}"
}

tooltip

echo "{\"text\":\"$longbob\", \"tooltip\":\"$weatherDataToPrint\"}"
