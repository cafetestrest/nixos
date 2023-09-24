{ config, lib, pkgs, inputs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    (mpv.override { scripts = [mpvScripts.mpris]; })
  ];

  home-manager.users.${user} = {
    home.file.".config/mpv" = {
      source = ./config;
      recursive = true;
    };
  };
}
