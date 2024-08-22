{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.mpv;
in
{
  options = {
    module.packages.mpv.enable = mkEnableOption "Enables mpv";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      (mpv.override { scripts = [mpvScripts.mpris]; })
    ];

    home.file = {
      ".config/mpv" = {
        source = ../config/mpv;
      };
    };
  };
}
