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

  # todo: https://jagotekno.com/cara-install-hyprland-nixos/
}
