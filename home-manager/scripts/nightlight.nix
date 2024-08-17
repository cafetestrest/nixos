{ config, pkgs, ... }:

let
  nightlight = pkgs.writeShellApplication {
    name = "nightlight";
    runtimeInputs = with pkgs; [
      wlsunset
      killall
    ];
    text = builtins.readFile ../../config/scripts/nightlight.sh;
  };
in
{
  home.packages = [ nightlight ];
}
