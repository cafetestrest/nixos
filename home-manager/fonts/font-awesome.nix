{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.font-awesome;
in
{
  options = {
    module.fonts.font-awesome.enable = mkEnableOption "Enables font font-awesome";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      font-awesome                    # for waybar icons
    ];
  };
}
