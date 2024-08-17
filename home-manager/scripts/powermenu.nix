{ config, pkgs, ... }:

let
  powermenu = pkgs.writeShellApplication {
    name = "powermenu";
    runtimeInputs = with pkgs; [
      killall
    ];
    text = builtins.readFile ../../config/scripts/powermenu.sh;
  };
in
{
  home.packages = [ powermenu ];
}
