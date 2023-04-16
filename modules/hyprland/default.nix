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
    wofi
    kitty
    waybar
  ];
}
