{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.bar.waybar;
in
{
  options = {
    module.bar.waybar.enable = mkEnableOption "Enables waybar";
  };

  config = mkIf cfg.enable {
    programs.waybar = {
      enable = true;
    };

    home.file = {
      #waybar config
      ".config/waybar/config.jsonc" = {
        source = ../config/waybar/config.jsonc;
      };

      #waybar style
      ".config/waybar/style.css" = {
        source = ../config/waybar/style.css;
      };

      # needs to be updated
      # #waybar script - weather.sh
      # ".config/waybar/scripts/weather.sh" = {
      #   source = ../config/waybar/scripts/weather.sh;
      #   executable = true;
      # };
      # #waybar script - weather.sh secrets - update
      # ".config/waybar/scripts/weather_sh.rc" = {
      #   source = ../config/waybar/scripts/weather_sh.rc;
      # };

      # #waybar script - battery.sh
      # ".config/waybar/scripts/battery.sh" = {
      #   source = ../config/waybar/scripts/battery.sh;
      #   executable = true;
      # };

      # #nighlight icon script - icon changes on/off for nightlight
      # ".config/waybar/scripts/nightlighticon.sh" = {
      #   source = ../config/waybar/scripts/nightlighticon.sh;
      #   executable = true;
      # };

      # #change audio output script
      # ".config/waybar/scripts/changeaudiooutput.sh" = {
      #   source = ../config/waybar/scripts/changeaudiooutput.sh;
      #   executable = true;
      # };

      # #change mic output script
      # ".config/waybar/scripts/changemicrophoneoutput.sh" = {
      #   source = ../config/waybar/scripts/changemicrophoneoutput.sh;
      #   executable = true;
      # };

      # #cpu usage percentage script
      # ".config/waybar/scripts/usagecpu.sh" = {
      #   source = ../config/waybar/scripts/usagecpu.sh;
      #   executable = true;
      # };

      # #ram memory usage gb script
      # ".config/waybar/scripts/usagememory.sh" = {
      #   source = ../config/waybar/scripts/usagememory.sh;
      #   executable = true;
      # };
    };
  };
}
