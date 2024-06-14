#!/usr/bin/env bash

# apps to open on startup
function open_startup_apps() {
    hyprctl dispatch exec "[workspace 1]" "terminator --working-directory ~/nixos"
    hyprctl dispatch exec "[workspace 1]" "NIXOS_OZONE_WL=1 codium ~/nixos/"
    hyprctl dispatch exec "[workspace 1]" chromium
    # hyprctl dispatch exec "[workspace 1]" "terminator --working-directory ~/.config/scripts"
    # hyprctl dispatch exec "[workspace 1]" "NIXOS_OZONE_WL=1 codium ~/.config/scripts"

    # startup_app_class_names (1st class)     (2nd class)     (3rd class) -> hyprctl clients (class: ***) up to 3 running apps
    # startup_app_class_names (left)          (right-upper)   (right-lower)
    startup_app_class_names=("Chromium-browser" "codium-url-handler" "terminator")
    # startup_app_class_names=("Chromium-browser" "terminator")
    sleep 1
}

sleep_time() {
    sleep 0.2
}

move_left() {
    hyprctl dispatch movewindow l
    sleep_time
}

move_right() {
    hyprctl dispatch movewindow r
    sleep_time
}

move_up() {
    hyprctl dispatch movewindow u
    sleep_time
}

move_down() {
    hyprctl dispatch movewindow d
    sleep_time
}

three_apps_moving() {
    # Determine movement based on monitorBreakingPoint
    if [[ $count -eq 0 ]]; then
        # First app: class_x and class_y < monitorBreakingPoint
        if [[ $class_x -ge $monitorBreakingPoint ]]; then
            move_left
        fi
        if [[ $class_y -ge $monitorBreakingPoint ]]; then
            move_up
        fi
    elif [[ $count -eq 1 ]]; then
        # Second app: class_x > monitorBreakingPoint, class_y < monitorBreakingPoint
        if [[ $class_x -le $monitorBreakingPoint ]]; then
            move_right
        fi
        if [[ $class_y -ge $monitorBreakingPoint ]]; then
            move_up
        fi
    elif [[ $count -eq 2 ]]; then
        # Third app: class_x and class_y > monitorBreakingPoint
        if [[ $class_x -le $monitorBreakingPoint ]]; then
            move_right
        fi
        if [[ $class_y -le $monitorBreakingPoint ]]; then
            move_down
        fi
    fi
}

two_apps_moving() {
    # Determine movement based on monitorBreakingPoint and class_x
    if [[ $count -eq 0 ]]; then
        # First app: class_x < monitorBreakingPoint
        if [[ $class_x -ge $monitorBreakingPoint ]]; then
            move_left
        fi
    elif [[ $count -eq 1 ]]; then
        # Second app: class_x > monitorBreakingPoint
        if [[ $class_x -le $monitorBreakingPoint ]]; then
            move_right
        fi
    fi
}

class_name_substitutes() {
    if [[ -z $classWindowInfo && "$class_name" == "codium-url-handler" ]]; then
        class_name="VSCodium"
        classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' "/class: $class_name/ {print}")
    fi

    if [[ -z $classWindowInfo && "$class_name" == "Chromium-browser" ]]; then
        class_name="chromium-browser"
        classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' "/class: $class_name/ {print}")
    fi
}

# Function to check the windows and focus history ID
check_apps_running() {
    count_app_classes=${#startup_app_class_names[@]}
    # echo "count: $count_app_classes"
    if [[ -z $count_app_classes || $count_app_classes -le 1 || $count_app_classes -ge 4 ]]; then
        echo "Add 2-3 apps, currently you have defined only startup_app_class_names: $count_app_classes"
        return 0
    fi

    monitorBreakingPoint=100
    count=0
    for class_name in "${startup_app_class_names[@]}"
    do
        classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' "/class: $class_name/ {print}")
        # echo "c: $classWindowInfo"

        class_name_substitutes

        if [[ -z $classWindowInfo ]]; then
            echo "Not running app with class: $class_name"
            return 1
        fi

        #focus on the current class_name:
        hyprctl dispatch focuswindow $class_name
        sleep_time

        class_at=$(echo "$classWindowInfo" | grep "at:" | awk '{print $2}' | head -1)
        class_x=$(echo "$class_at" | cut -d, -f1)
        class_y=$(echo "$class_at" | cut -d, -f2)

        # echo "$class_name x: $class_x"
        # echo "$class_name y: $class_y"
        # echo "$class_name at: $class_at"

        # echo "$count_app_classes, this one is: $class_name"

        if [[ $count_app_classes -eq 3 ]]; then
            three_apps_moving
        fi

        if [[ $count_app_classes -eq 2 ]]; then
            two_apps_moving
        fi

        pause_playing_media

        count=$((count+1))
    done

    # echo "count: $count, arg eq= $#"
    echo "Apps moved successfully, exiting"

    return 0
}

pause_playing_media() {
    if [[ -z "$is_media_paused" ]]; then
        status=$(playerctl status)
        # echo "media status: $status"

        if [ "$status" == "Playing" ]; then
            playerctl pause
            is_media_paused=1
            echo "paused playing media"
        fi
    fi
}

open_startup_apps

# Main loop to retry for 10 seconds
is_media_paused=
end=$((SECONDS+10))
while [ $SECONDS -lt $end ]; do
    # Gets the hyprland clients (apps) running
    output=$(hyprctl clients)

    pause_playing_media

    if check_apps_running; then
        pause_playing_media
        exit 0
    fi
    sleep 0.5
done

echo "done, exiting"
