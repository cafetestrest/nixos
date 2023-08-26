{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  home-manager.users.${user} = {
    home.file = {
      #weather script used for ags
      ".config/scripts/weather.sh" = {
        source = ./weather.sh;
        executable = true;
      };

      #swayidle used to fine crontrol swayidle -> toggle/startup/icon script
      ".config/scripts/swayidle.sh" = {
        source = ./swayidle.sh;
        executable = true;
      };

      #night light config script
      ".config/scripts/nightlight.sh" = {
        source = ./nightlight.sh;
        executable = true;
      };

      #script for control of note (waybar and ags) - note.sh
      ".config/scripts/note.sh" = {
        source = ./note.sh;
        executable = true;
      };

      #used for screenshot, left and right click (waybar and ags) - screenshot.sh
      ".config/scripts/screenshot.sh" = {
        source = ./screenshot.sh;
        executable = true;
      };

      #startup script (hyprland) - checks if media is playing and stops it
      ".config/scripts/startup.sh" = {
        source = ./startup.sh;
        executable = true;
      };

      #checks if media is playing before it can put to idle (hyprland)
      ".config/scripts/idle.sh" = {
        source = ./idle.sh;
        executable = true;
      };
    };
  };
}
