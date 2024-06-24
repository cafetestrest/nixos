{ config, pkgs, ... }:

let
  headset = pkgs.writeShellApplication {
    name = "headset";
    text = builtins.readFile ../../config/scripts/headset.sh;
  };
in
{
  home.packages = [ headset ];
}
