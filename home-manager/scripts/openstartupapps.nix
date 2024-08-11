{ config, pkgs, ... }:

let
  openstartupapps = pkgs.writeShellApplication {
    name = "openstartupapps";
    text = builtins.readFile ../../config/scripts/openstartupapps.sh;
  };
in
{
  home.packages = [ openstartupapps ];
}
