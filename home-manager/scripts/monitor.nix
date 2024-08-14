{ config, pkgs, ... }:

let
  monitor = pkgs.writeShellApplication {
    name = "monitor";
    runtimeInputs = with pkgs; [ddcutil];
    text = builtins.readFile ../../config/scripts/monitor.sh;
  };
in
{
  home.packages = [ monitor ];
}
