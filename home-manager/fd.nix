{ config, pkgs, ... }:

{
  programs.fd = {
    enable = true;
  };

  home.shellAliases = {
    find = "fd";
  };
}
