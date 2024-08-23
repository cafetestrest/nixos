{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.programs.teamviewer;
in
{
  options = {
    module.programs.teamviewer.enable = mkEnableOption "Enables teamviewer";
  };

  config = mkIf cfg.enable {
    services.teamviewer.enable = true;
  };
}
