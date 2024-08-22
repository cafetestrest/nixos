{ config, lib, pkgs, ... }:

with lib;

let
  nightlight = pkgs.writeShellApplication {
    name = "nightlight";
    runtimeInputs = with pkgs; [
      wlsunset
      killall
    ];
    text = builtins.readFile ../../config/scripts/nightlight.sh;
  };

  cfg = config.module.scripts.nightlight;
in
{
  options = {
    module.scripts.nightlight.enable = mkEnableOption "Enables nightlight scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ nightlight ];
  };
}
