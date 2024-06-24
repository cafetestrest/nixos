{ config, pkgs, ... }:

let
  powermenu = pkgs.writeShellApplication {
    name = "powermenu";
    text = builtins.readFile ../../config/scripts/powermenu.sh;
  };
in
{
  home.packages = [ powermenu ];
}
