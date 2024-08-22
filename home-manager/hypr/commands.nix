{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.hypr.commands;
  cfgXdg = config.module.xdg;
in
{
  options = {
    module.hypr.commands.enable = mkEnableOption "Enables hyprland commands";
  };

  config = mkIf (cfg.enable && cfgXdg.enable) {
    xdg.desktopEntries."org.gnome.Settings" = {
      name = "Settings";
      comment = "Gnome Control Center";
      icon = "org.gnome.Settings";
      exec = "env XDG_CURRENT_DESKTOP=gnome ${pkgs.gnome.gnome-control-center}/bin/gnome-control-center";
      categories = [ "X-Preferences" ];
      terminal = false;
    };

    xdg.desktopEntries."shutdown" = {
      name = "Shutdown";
      comment = "Power Off - Turn Off";
      icon = "system-shutdown-symbolic";
      exec = "shutdown now";
      terminal = false;
    };

    xdg.desktopEntries."restart" = {
      name = "Restart";
      comment = "Reboot";
      icon = "system-reboot-symbolic";
      exec = "systemctl reboot";
      terminal = false;
    };

    xdg.desktopEntries."logout" = {
      name = "Log Out";
      comment = "Sign Out";
      icon = "system-log-out-symbolic";
      exec = "loginctl terminate-user ${vars.user}";
      terminal = false;
    };

    xdg.desktopEntries."lock" = {
      name = "Lock";
      comment = "Locks PC";
      icon = "system-lock-screen-symbolic";
      exec = "idle l";
      terminal = false;
    };

    xdg.desktopEntries."sleep" = {
      name = "Sleep";
      comment = "Put PC to Sleep";
      icon = "weather-clear-night-symbolic";
      exec = "idle s";
      terminal = false;
    };

    xdg.desktopEntries."nightlight" = {
      name = "Nightlight";
      comment = "Toggle Night light";
      icon = "night-light-symbolic";
      exec = "nightlight toggle";
      terminal = false;
    };

    xdg.desktopEntries."idle" = {
      name = "Idle";
      comment = "Toggle Idle mode";
      icon = "view-reveal-symbolic";
      exec = "toggleidle toggle";
      terminal = false;
    };

    xdg.desktopEntries."screenshot" = {
      name = "Screenshot";
      comment = "Take a desktop screenshot";
      icon = "applets-screenshooter-symbolic";
      exec = "screenshot";
      terminal = false;
    };

    xdg.desktopEntries."screenshot-select" = {
      name = "Screenshot Select";
      comment = "Take a selective screenshot of the region";
      icon = "edit-select-all-symbolic";
      exec = "screenshot 1";
      terminal = false;
    };
  };
}
