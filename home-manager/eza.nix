{ config, pkgs, ... }:

{
  programs.eza = {
    enable = true;
    icons = true;
    git = true;

    extraOptions = [
      "--group"
      "--group-directories-first"
      "--header"
      "--no-permissions"
      "--octal-permissions"
    ];
  };
}
