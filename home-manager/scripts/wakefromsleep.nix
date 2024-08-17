{ config, pkgs, ... }:

let
  wakefromsleep = pkgs.writeShellApplication {
    name = "wakefromsleep";
    runtimeInputs = with pkgs; [
      bc
    ];
    text = builtins.readFile ../../config/scripts/wakefromsleep.sh;
  };
in
{
  home.packages = [ wakefromsleep ];
}
