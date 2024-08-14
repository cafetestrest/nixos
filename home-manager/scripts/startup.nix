{ config, pkgs, ... }:

let
  startup = pkgs.writeShellApplication {
    name = "startup";
    runtimeInputs = with pkgs; [
      unstable.hypridle
      wlsunset
    ];
    text = builtins.readFile ../../config/scripts/startup.sh;
  };
in
{
  home.packages = [ startup ];
}
