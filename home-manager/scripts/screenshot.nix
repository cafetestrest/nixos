{ config, pkgs, ... }:

let
  screenshot = pkgs.writeShellApplication {
    name = "screenshot";
    runtimeInputs = with pkgs; [
      libnotify
      slurp
      grim
    ];
    text = builtins.readFile ../../config/scripts/screenshot.sh;
  };
in
{
  home.packages = [ screenshot ];
}
