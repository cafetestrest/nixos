{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.fastfetch;
in
{
  options = {
    module.packages.fastfetch.enable = mkEnableOption "Enables fastfetch";
  };

  config = mkIf cfg.enable {
    programs.fastfetch = {
      enable = true;
      settings = {
        logo = {
          padding = {
            top = 0;
          };
        };
        modules = [
          "title"
          # "separator"
          "os"
          "host"
          "kernel"
          "uptime"
          "packages"
          "shell"
          # "display"
          "de"
          "wm"
          "wmtheme"
          "theme"
          "icons"
          # "font"
          "cursor"
          "terminal"
          "terminalfont"
          "cpu"
          "gpu"
          "memory"
          "disk"
          # "localip"
          # "battery"
          # "poweradapter"
          # "locale"
          "break"
          "colors"
        ];
      };
    };

    home.shellAliases = {
      neofetch = "fastfetch";
    };
  };
}
