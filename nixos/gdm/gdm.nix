{ config, pkgs, vars, ... }:

{
  services.xserver.displayManager.gdm.enable = true;
  # services.xserver.displayManager.gdm.settings = {
  # };

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

  # services.xserver.displayManager.autoLogin.enable = true;  # Enable automatic login for the user.
  # services.xserver.displayManager.autoLogin.user = "${vars.user}";

  # systemd.services."getty@tty1".enable = false; # Workaround for GNOME autologin: https://github.com/NixOS/nixpkgs/issues/103746#issuecomment-945091229
  # systemd.services."autovt@tty1".enable = false;

  # dconf currently enabled under original configuration.nix file
  # programs.dconf.enable = true;
}
