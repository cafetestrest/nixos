{ config, lib, ... }:

with lib;

let
  cfg = config.module.gnome.autostart.albert;
in
{
  options = {
    module.gnome.autostart.albert.enable = mkEnableOption "Enables albert on start";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/autostart/albert.desktop".text = ''
        #!/usr/bin/env xdg-open
        [Desktop Entry]
        Categories=Utility;
        Comment=A desktop agnostic launcher
        Exec=albert
        GenericName=Launcher
        Icon=albert
        Name=Albert
        StartupNotify=false
        Type=Application
        Version=1.0
      '';
    };
  };
}
