{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  home-manager.users.${user} = {
    home.file = {
      ".config/scripts/weather.sh" = {
        source = ./weather.sh;
        executable = true;
      };
    };
  };
}
