{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
  user;
in
{
  users.users.${user} = {
    packages = with pkgs; [
      shotwell                #photo editor for gnome
    ];
  };

  environment.systemPackages = with pkgs; [
    gnome.gnome-tweaks        #gnome tweaks app
    gnome.gnome-themes-extra  #for building orchid theme (with sassc)
    gnome.dconf-editor        #gnome dconf editor app

    numlockx                  #get numlock enabled on login (need to find how to enable it on gdm)
  ];
}
