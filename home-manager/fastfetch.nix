{ config, pkgs, ... }:

{
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
}
