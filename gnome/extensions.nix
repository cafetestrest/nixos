{ config, pkgs, ... }:

let
  inherit (import ./variables.nix)
  user;
in
{
  users.users.${user} = {
    packages = with pkgs; [
      gnomeExtensions.dash-to-panel
      gnomeExtensions.caffeine
      gnomeExtensions.blur-my-shell
    ];
  };
}

