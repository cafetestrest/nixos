{ config, pkgs, vars, ... }:

{
  home.file = {
    ".config/copyq/copyq.conf" = {
      source = ../config/copyq/copyq.conf;
    };

    ".config/copyq/copyq-commands.ini" = {
      source = ../config/copyq/copyq-commands.ini;
    };
  };
}
