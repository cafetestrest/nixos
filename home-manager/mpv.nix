{ config, lib, pkgs, inputs, ... }:

{
  home.packages = with pkgs; [
    (mpv.override { scripts = [mpvScripts.mpris]; })
  ];

  home.file = {
    ".config/mpv" = {
      source = ../config/mpv;
    };
  };
}
