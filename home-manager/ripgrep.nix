{ config, pkgs, ... }:

{
  programs.ripgrep = {
    enable = true;
  };

  home.shellAliases = {
    grep = "rg";
  };
}
