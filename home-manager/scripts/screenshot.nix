{ config, lib, pkgs, ... }:

with lib;

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

  cfg = config.module.scripts.screenshot;
in
{
  options = {
    module.scripts.screenshot.enable = mkEnableOption "Enables screenshot scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ screenshot ];
  };
}
