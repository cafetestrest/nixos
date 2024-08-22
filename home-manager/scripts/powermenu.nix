{ config, lib, pkgs, ... }:

with lib;

let
  powermenu = pkgs.writeShellApplication {
    name = "powermenu";
    runtimeInputs = with pkgs; [
      killall
    ];
    text = builtins.readFile ../../config/scripts/powermenu.sh;
  };

  cfg = config.module.scripts.powermenu;
in
{
  options = {
    module.scripts.powermenu.enable = mkEnableOption "Enables powermenu scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ powermenu ];
  };
}
