{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.teamviewer;
in
{
  options = {
    module.packages.teamviewer.enable = mkEnableOption "Enables teamviewer";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      teamviewer
    ];
  };
}
