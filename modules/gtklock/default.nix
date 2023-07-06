{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    gtklock
    gtklock-userinfo-module
    gtklock-powerbar-module
  ];

  home-manager.users.${user} = {
    home.file = {
      ".config/gtklock/config.ini" = {
        source = ./config/gtklock/config.ini;
      };
      ".config/gtklock/style.css" = {
        source = ./config/gtklock/style.css;
      };
    };
  };

  security.pam.services.gtklock = {
    text = ''
     auth include login
    '';
  };
}
