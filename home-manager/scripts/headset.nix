{ config, pkgs, ... }:

let
  headset = pkgs.writeShellApplication {
    name = "headset";
    runtimeInputs = with pkgs; [headsetcontrol];
    text = builtins.readFile ../../config/scripts/headset.sh;
  };
in
{
  home.packages = [ headset ];
}
