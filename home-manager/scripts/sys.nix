{ config, pkgs, ... }:

let
  sys = pkgs.writeShellApplication {
    name = "sys";
    text = builtins.readFile ../../config/scripts/sys.sh;
  };
in
{
  home.packages = [ sys ];
}
