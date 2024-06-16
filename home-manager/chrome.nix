{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    chromium              #chromium browser
  ];
}
