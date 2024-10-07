{ config, lib, pkgs, ... }:

with lib;

let
  toggleidle = pkgs.writeShellApplication {
    name = "toggleidle";
    runtimeInputs = with pkgs; [
      hypridle
    ];
    text = builtins.readFile ../../config/scripts/toggleidle.sh;
  };

  cfg = config.module.scripts.toggleidle;
in
{
  options = {
    module.scripts.toggleidle.enable = mkEnableOption "Enables toggleidle scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ toggleidle ];
  };
}
