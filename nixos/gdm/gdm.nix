{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.display-manager.gdm;
in
{
  options = {
    module.display-manager.gdm.enable = mkEnableOption "Enables GDM";
  };

  config = mkIf cfg.enable {
    services.xserver.displayManager.gdm.enable = true;
    # services.xserver.displayManager.gdm.settings = {
    # };

    environment.systemPackages = with pkgs; [
      apple-cursor #cursor package for GDM session  #TODO move out, maybe to user config
    ];

    programs.dconf.enable = true;

    programs.dconf.profiles = { #TODO
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
            monospace-font-name = "Source Code Pro 10";

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
