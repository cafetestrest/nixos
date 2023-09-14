{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  imports = [
    ../waybar                   # top bar
    ../rofi                     # search bar
    # ../swaync                   # notification panel
    ../gtklock                  # lockscreen
    ../ags                      # https://github.com/Aylur/ags
  ];

  programs.hyprland.enable = true;

  nix.settings = {
    substituters = ["https://hyprland.cachix.org"];
    trusted-public-keys = ["hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="];
  };

  users.users.${user} = {
    packages = with pkgs; [
    ];
  };

  environment.systemPackages = with pkgs; [
    wlsunset                            #night light for wayland
    wlogout                             #logout for wayland - can be deleted and used wofi
    grim                                #screenshot tool
    slurp                               #select a screenshot region
    swaybg                              #wallpaper
    swayidle                            #idle manager for sway/hyprland
    gnome.nautilus                      #file manager
    gnome-text-editor
    gnome.gnome-calculator
    gnome.gnome-font-viewer
    gnome.gnome-disk-utility
    gnome.gnome-characters              #check all characters, can be copied
  ];

  home-manager.users.${user} = {
    home.file = {
      ".config/hypr/hyprland.conf" = {
        source = ./config/hyprland.conf;
      };
    };
  };
}

#in case there is a problem with some apps being slow, run the following line on terminal without root:
#systemctl --user mask xdg-desktop-portal-gnome
#systemctl --user mask xdg-desktop-portal-gtk