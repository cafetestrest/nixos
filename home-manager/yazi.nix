{ config, lib, pkgs, ... }:

{
  programs.yazi = {
    enable = true;
  };

  home.shellAliases = {
    f = "yazi";
  };
}
