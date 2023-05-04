{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  users.users.${user} = {
    packages = with pkgs; [
    ];
  };

  environment.systemPackages = with pkgs; [
    # unstable.wofi                                #apps/power menu
    rofi-wayland
    rofimoji
    # tofi
    # unstable.fuzzel
    # dmenu-wayland
    # bemenu
    # rofi-power-menu
    kitty                               #terminal - can be deleted and used terminator
    wlsunset                            #night light for wayland
    wlogout                             #logout for wayland - can be deleted and used wofi
    grim                                #screenshot tool
    slurp                               #select a screenshot region
    swaybg                              #wallpaper
    swaynotificationcenter              #notifications
    # dunst
    bc                                  #command line calculator (for weather widget on waybar) 
    # eww-wayland
  ];

  home-manager.users.${user} = {
    home.file = {
      ".config/hypr/hyprland.conf" = {
        source = ./config/hyprland.conf;
      };
    };
  };
}
