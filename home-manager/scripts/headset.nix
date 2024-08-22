{ config, lib, pkgs, ... }:

with lib;

let
  headset = pkgs.writeShellApplication {
    name = "headset";
    runtimeInputs = with pkgs; [headsetcontrol];
    text = builtins.readFile ../../config/scripts/headset.sh;
  };

  cfg = config.module.scripts.headset;
in
{
  options = {
    module.scripts.headset.enable = mkEnableOption "Enables headset scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ headset ];
  };
}
