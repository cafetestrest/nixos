{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    distrobox             #distibutions in docker container
  ];
}
