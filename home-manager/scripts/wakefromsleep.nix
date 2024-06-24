{ config, pkgs, ... }:

let
  wakefromsleep = pkgs.writeShellApplication {
    name = "wakefromsleep";
    text = builtins.readFile ../../config/scripts/wakefromsleep.sh;
  };
in
{
  home.packages = [ wakefromsleep ];
}
