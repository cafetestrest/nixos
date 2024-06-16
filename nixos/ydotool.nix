{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user;
in
{
  programs.ydotool.enable = true;

  users.users.${user} = {
    extraGroups = [
      "ydotool"
    ];
  };
}
