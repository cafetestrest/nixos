{ inputs, pkgs, vars, ... }:

{
  home.packages = with pkgs; [ unstable.hypridle ];

xdg.configFile."hypr/hypridle.conf".text = ''
general {
    lock_cmd = pidof hyprlock || hyprlock       # avoid starting multiple hyprlock instances.
    before_sleep_cmd = loginctl lock-session    # lock before suspend.
    after_sleep_cmd = hyprctl dispatch dpms on  # to avoid having to press a key twice to turn on the display.
}

#listener {
#    timeout = 150                                # 2.5min.
#    on-timeout = brightnessctl -s set 10         # set monitor backlight to minimum, avoid 0 on OLED monitor.
#    on-resume = brightnessctl -r                 # monitor backlight restore.
#}

# turn off keyboard backlight, comment out this section if you dont have a keyboard backlight.
#listener { 
#    timeout = 150                                          # 2.5min.
#    on-timeout = brightnessctl -sd rgb:kbd_backlight set 0 # turn off keyboard backlight.
#    on-resume = brightnessctl -rd rgb:kbd_backlight        # turn on keyboard backlight.
#}

listener {
    timeout = 600                                 # 10min
    on-timeout = loginctl lock-session            # lock screen when timeout has passed
}

listener {
    timeout = 660                                 # 11min
    on-timeout = hyprctl dispatch dpms off        # screen off when timeout has passed
    on-resume = hyprctl dispatch dpms on          # screen on when activity is detected after timeout has fired.
}

listener {
    timeout = 720                                 # 12min
    on-timeout = systemctl suspend                # suspend pc
}
  '';

  # services.hypridle = {
  #   enable = true;
  #   lockCmd = "${lib.getExe pkgs.hyprlock}";
  #   beforeSleepCmd = "${lib.getExe pkgs.hyprlock}";
  #   listeners = [
  #     {
  #       timeout = 300;
  #       onTimeout = "${lib.getExe pkgs.hyprlock}";
  #     }
  #     {
  #       timeout = 305;
  #       onTimeout = "${pkgs.hyprland}/bin/hyprctl dispatch dpms off";
  #       onResume = "${pkgs.hyprland}/bin/hyprctl dispatch dpms on";
  #     }
  #   ];
  # };

  #   home.packages = with pkgs; [ hypridle ];

  # xdg.configFile."hypr/hypridle.conf".text = ''
  #   general {
  #       ignore_dbus_inhibit = false
  #   }

  #   # Screenlock
  #   listener {
  #       timeout = 600
  #       on-timeout = ${pkgs.hyprlock}/bin/hyprlock
  #       on-resume = ${pkgs.libnotify}/bin/notify-send "Welcome back ${config.home.user}!"
  #   }

  #   # Suspend
  #   listener {
  #       timeout = 660
  #       on-timeout = systemctl suspend
  #       # on-resume = ${pkgs.libnotify}/bin/notify-send "Welcome back to your desktop!"
  #   }
  # '';
}
