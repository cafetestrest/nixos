{ config, pkgs, ... }:

{
  home.file = {
    #startup script used only to run other scripts on hyprland startup
    ".config/scripts/startup.sh" = {
      source = ../config/scripts/startup.sh;
      executable = true;
    };

    #yr-weather script used for ags
    ".config/scripts/bluetoothbatterypercentage.sh" = {
      source = ../config/scripts/bluetoothbatterypercentage.sh;
      executable = true;
    };

    #yr-weather script used for ags
    ".config/scripts/yrweather.sh" = {
      source = ../config/scripts/yrweather.sh;
      executable = true;
    };

    #openweathermap script used for ags
    ".config/scripts/openweathermap.sh" = {
      source = ../config/scripts/openweathermap.sh;
      executable = true;
    };

    #swayidle used to fine crontrol swayidle -> toggle/startup/icon script
    ".config/scripts/swayidle.sh" = {
      source = ../config/scripts/swayidle.sh;
      executable = true;
    };

    #night light config script
    ".config/scripts/nightlight.sh" = {
      source = ../config/scripts/nightlight.sh;
      executable = true;
    };

    #script for control of note (waybar and ags) - note.sh
    ".config/scripts/note.sh" = {
      source = ../config/scripts/note.sh;
      executable = true;
    };

    #used for screenshot, left and right click (waybar and ags) - screenshot.sh
    ".config/scripts/screenshot.sh" = {
      source = ../config/scripts/screenshot.sh;
      executable = true;
    };

    #startup script (hyprland) - checks if media is playing and stops it
    ".config/scripts/playerstartup.sh" = {
      source = ../config/scripts/playerstartup.sh;
      executable = true;
    };

    #checks if media is playing before it can put to idle (hyprland)
    ".config/scripts/idle.sh" = {
      source = ../config/scripts/idle.sh;
      executable = true;
    };

    #power menu script - hyprland bindings and waybar
    ".config/scripts/powermenu.sh" = {
      source = ../config/scripts/powermenu.sh;
      executable = true;
    };

    #script that runs when the swayidle resumes from sleep
    ".config/scripts/wakefromsleep.sh" = {
      source = ../config/scripts/wakefromsleep.sh;
      executable = true;
    };

    #script that start ngrok for warden env
    ".config/scripts/ngrokwarden.sh" = {
      source = ../config/scripts/ngrokwarden.sh;
      executable = true;
    };

    #headset battery % and chatmix
    ".config/scripts/headset.sh" = {
      source = ../config/scripts/headset.sh;
      executable = true;
    };
  
    #monitor control using ddcutil
    ".config/scripts/monitor.sh" = {
      source = ../config/scripts/monitor.sh;
      executable = true;
    };
  };
}
