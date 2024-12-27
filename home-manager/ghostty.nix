{ config, lib, pkgs, inputs, ... }:

with lib;

let
  cfg = config.module.packages.ghostty;
in
{
  options = {
    module.packages.ghostty.enable = mkEnableOption "Enables ghostty terminal emulator";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      inputs.ghostty.packages.x86_64-linux.default
    ];

    home.file = {
      ".config/ghostty/config" = {
        source = ../config/terminal/ghostty/config;
      };
    };
  };
}
