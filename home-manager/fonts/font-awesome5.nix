{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.font-awesome5;
in
{
  options = {
    module.fonts.font-awesome5.enable = mkEnableOption "Enables font font-awesome_5";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      font-awesome_5
    ];
  };
}
