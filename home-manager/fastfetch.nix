{ config, pkgs, ... }:

{
  home.file = {
    ".config/fastfetch/config.jsonc" = {
      source = ../config/fastfetch/config.jsonc;
    };
  };
}
