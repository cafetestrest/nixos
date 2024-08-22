{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.roboto;
in
{
  options = {
    module.fonts.roboto.enable = mkEnableOption "Enables font roboto";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      roboto
    ];
  };
}
