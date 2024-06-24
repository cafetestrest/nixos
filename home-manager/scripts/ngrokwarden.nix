{ config, pkgs, ... }:

let
  ngrokwarden = pkgs.writeShellApplication {
    name = "ngrokwarden";
    text = builtins.readFile ../../config/scripts/ngrokwarden.sh;
  };
in
{
  home.packages = [ ngrokwarden ];
}
