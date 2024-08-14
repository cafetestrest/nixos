{ config, pkgs, ... }:

let
  openstartupapps = pkgs.writeShellApplication {
    name = "openstartupapps";
    # runtimeInputs = with pkgs; [
    #   # playerctl
    # ];
    text = builtins.readFile ../../config/scripts/openstartupapps.sh;
  };
in
{
  home.packages = [ openstartupapps ];
}
