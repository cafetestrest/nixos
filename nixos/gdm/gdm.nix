{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.display-manager.gdm;
  cursorPackageCfg = config.module.gtk.cursorPackage;
in
{
  options = {
    module.display-manager.gdm.enable = mkEnableOption "Enables GDM";
    module.gtk.cursorPackage = mkOption {
      type = types.package;
      description = "Package to be included when GDM is enabled";
      default = pkgs.apple-cursor;
    };
  };

  config = mkIf cfg.enable {
    services.xserver.displayManager.gdm.enable = true;
    # services.xserver.displayManager.gdm.settings = {
    # };

    environment.systemPackages = with pkgs; [
      cursorPackageCfg
    ];

    programs.dconf.enable = true;

    programs.dconf.profiles = {
      gdm.databases = [{
        settings = {
          "org/gnome/desktop/peripherals/keyboard" = {
            numlock-state = true;
            remember-numlock-state = true;
          };
          "org/gnome/desktop/interface" = {
            #theme
            gtk-theme = "${vars.gtk.gtkTheme}";

            #fonts
            font-name = "${vars.gtk.gtkFontName}";
            document-font-name = "${vars.gtk.gtkFontName}";
            monospace-font-name = "Ubuntu Sans Mono 13";

            #cursor
            cursor-theme = "${vars.gtk.cursorTheme}";

            #icon
            icon-theme = "${vars.gtk.gtkIconTheme}";

            #clock in top bar
            clock-show-seconds = true;
            clock-show-weekday = true;

            #dark theme
            color-scheme = "prefer-dark";
          };

          "org/gnome/settings-daemon/plugins/color" = {
            night-light-enabled = true;
            night-light-schedule-automatic = true;
            night-light-temperature = "2700";
          };
        };
      }];
    };
  };
}
