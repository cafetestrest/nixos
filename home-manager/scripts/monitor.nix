{ config, lib, pkgs, ... }:

with lib;

let
  monitor = pkgs.writeShellApplication {
    name = "monitor";
    runtimeInputs = with pkgs; [ddcutil];
    text = builtins.readFile ../../config/scripts/monitor.sh;
  };

  cfg = config.module.scripts.monitor;
in
{
  options = {
    module.scripts.monitor.enable = mkEnableOption "Enables monitor scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ monitor ];
  };
}
