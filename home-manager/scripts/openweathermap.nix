{ config, lib, pkgs, ... }:

with lib;

let
  openweathermap = pkgs.writeShellApplication {
    name = "openweathermap";
    runtimeInputs = with pkgs; [
      bc
      jq
    ];
    text = builtins.readFile ../../config/scripts/openweathermap.sh;
  };

  cfg = config.module.scripts.openweathermap;
in
{
  options = {
    module.scripts.openweathermap.enable = mkEnableOption "Enables openweathermap scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ openweathermap ];
  };
}
