#!/usr/bin/env bash

# apps to open on startup
function open_startup_apps() {
    hyprctl dispatch exec "[workspace 1]" "terminator --working-directory ~/nixos"
    hyprctl dispatch exec "[workspace 1]" "codium ~/nixos/"
    hyprctl dispatch exec "[workspace 1]" chromium
    # hyprctl dispatch exec "[workspace 1]" "terminator --working-directory ~/.config/scripts"
    # hyprctl dispatch exec "[workspace 1]" "codium ~/.config/scripts"
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

# Function to check the windows and focus history ID
check_apps_running() {
    # if [[ $# -le 1 || $# -ge 4 ]]; then
    #     echo "check_apps_running (1st class) (2nd class) (3rd class) -> hyprctl clients (class: ***) up to 3 running apps"
    #     return 1
    # fi

    monitorBreakingPoint=100
    count=0
    for class_name in "$@"
    do
        classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' "/class: $class_name/ {print}")
        # classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' 'tolower($0) ~ tolower("class: '"$class_name"'") {print}')

        # echo "c: $classWindowInfo"

        if [[ -z $classWindowInfo && "$class_name" == "codium-url-handler" ]]; then
            class_name="VSCodium"
            classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' "/class: $class_name/ {print}")
        fi

        if [[ -z $classWindowInfo && "$class_name" == "Chromium-browser" ]]; then
            class_name="chromium-browser"
            classWindowInfo=$(echo "$output" | awk -v RS= -v ORS='\n\n' "/class: $class_name/ {print}")
        fi

        if [[ -z $classWindowInfo ]]; then
            echo "Not running app with class: $class_name"
            return 1
        fi

        #focus on the current class_name:
        hyprctl dispatch focuswindow $class_name
        sleep_time

        class_at=$(echo "$classWindowInfo" | grep "at:" | awk '{print $2}')
        class_x=$(echo "$class_at" | cut -d, -f1)
        class_y=$(echo "$class_at" | cut -d, -f2)

        # echo "$class_name x: $class_x"
        # echo "$class_name y: $class_y"
        # echo "$class_name at: $class_at"

        if [[ $# -eq 3 ]]; then
            three_apps_moving
        fi

        if [[ $# -eq 2 ]]; then
            two_apps_moving
        fi

        count=$((count+1))
    done

    # echo "count: $count, arg eq= $#"

    return 0
}

pause_playing_media() {
    if [[ -z "$is_media_paused" ]]; then
        status=$(playerctl status)
        # echo "media status: $status"

        if [ "$status" = "Playing" ]; then
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

    pause_playing_media

    # Gets the hyprland clients (apps) running
    output=$(hyprctl clients)

    # check_apps_running (1st class)     (2nd class)     (3rd class) -> hyprctl clients (class: ***) up to 3 running apps
    # check_apps_running (left)          (right-upper)   (right-lower)
    # if check_apps_running "Chromium-browser" "terminator"; then
    if check_apps_running "Chromium-browser" "codium-url-handler" "terminator"; then
        pause_playing_media

        echo "Apps moved successfully, exiting"
        exit 0
    fi
    sleep 0.5
done

echo "done, exiting"
