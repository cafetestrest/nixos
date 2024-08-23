{ config, lib, ... }:

with lib;

let
  cfg = config.module.screen-locker.gtklock;
in
{
  options = {
    module.screen-locker.gtklock.enable = mkEnableOption "Enables swaylock config";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/gtklock/config.ini".text = ''
        [main]
        modules=/run/current-system/sw/lib/gtklock/powerbar-module.so;/run/current-system/sw/lib/gtklock/userinfo-module.so
        time-format=%R

        [userinfo]
        under-clock=true
        image-size=128
        no-round-image=false
        horizontal-layout=false

        [powerbar]
        show-labels=false
        linked-buttons=false
      '';

      ".config/gtklock/style.css" = {
        source = ../config/gtklock/style.css;
      };

      #####should stay removed as we are applying the same fix via overlay patch
      # ".config/gtklock/gtklock.ui" = {
      #   source = ../config/gtklock/gtklock.ui;
      # };
    };
  };
}
