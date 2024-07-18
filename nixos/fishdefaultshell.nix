{ config, pkgs, ... }:

{
  users.defaultUserShell = pkgs.fish;

  programs.fish = {
    enable = true;
  };
}
