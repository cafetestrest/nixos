{ inputs, pkgs, ... }:

{
  services.xserver.displayManager.startx.enable = true;

  programs.hyprland = {
    enable = true;
    package = inputs.hyprland.packages.${pkgs.system}.hyprland;
    xwayland.enable = true;
  };

  xdg.portal = {
    enable = true;
    extraPortals = [ pkgs.xdg-desktop-portal-gtk ];
  };

  security = {
    polkit.enable = true;
    pam.services.ags = {};
  };

  nix.settings = {
    substituters = ["https://hyprland.cachix.org"];
    trusted-public-keys = ["hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="];
  };

  # environment.sessionVariables.NIXOS_OZONE_WL = "1"; # Hint electron apps to use wayland
  # environment.sessionVariables = {
  #   ELECTRON_OZONE_PLATFORM_HINT = "auto";
  #   NIXOS_OZONE_WL = "1";
  # };

  environment.systemPackages = with pkgs; [
    # ags
    wlsunset                            #night light for wayland
    # wlogout                             #logout for wayland - can be deleted and used wofi
    grim                                #screenshot tool
    slurp                               #select a screenshot region
    # swaybg                              #wallpaper
    # swayidle                            #idle manager for sway/hyprland
    hyprpicker                          #pipette - color hex picker
    loupe                               #image viewer
    gnome.nautilus                      #file manager
    gnome-text-editor
    gnome.gnome-calculator
    gnome.gnome-font-viewer
    gnome.gnome-disk-utility
    gnome.gnome-characters              #check all characters, can be copied
    gnome.adwaita-icon-theme
    gnome.baobab
    gnome.gnome-calendar
    gnome.gnome-boxes
    gnome.gnome-system-monitor
    gnome.gnome-control-center
    gnome.gnome-weather
    gnome.gnome-clocks
    gnome.gnome-software # for flatpak
  ];

  systemd = {
    user.services.polkit-gnome-authentication-agent-1 = {
      description = "polkit-gnome-authentication-agent-1";
      wantedBy = [ "graphical-session.target" ];
      wants = [ "graphical-session.target" ];
      after = [ "graphical-session.target" ];
      serviceConfig = {
        Type = "simple";
        ExecStart = "${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1";
        Restart = "on-failure";
        RestartSec = 1;
        TimeoutStopSec = 10;
      };
    };
  };

  services = {
    gvfs.enable = true; #allows applications to access various types of file systems (local, remote, etc.)
    devmon.enable = true; #(Device Monitor) automates the mounting and unmounting of removable devices like USB drives
    udisks2.enable = true;  #tools, and a library to handle storage devices and disk management
    colord.enable = true;  #Whether to enable colord, the color management daemon
    upower.enable = true; #provides power management support, primarily for battery-powered devices
    # power-profiles-daemon.enable = true;  #manages and applies power profiles (like power saving or performance)
    # accounts-daemon.enable = true;  #provides user account information to applications login details and user-specific
    gnome = {
      evolution-data-server.enable = true;  # applications that manage contacts, calendars, tasks, and notes
      glib-networking.enable = true;  #support for secure connections using TLS/SSL
      gnome-keyring.enable = true;  #stores and manages security credentials like passwords and encryption keys
      # gnome-online-accounts.enable = true;  #GNOME Online Accounts integrates online services (like Google, Facebook)
    };
  };
}
