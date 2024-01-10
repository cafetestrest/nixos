{ config, lib, pkgs, ... }:

{
  home.file = {
    ".config/swaylock/config" = {
      source = ../config/swaylock/config;
    };
  };
}
