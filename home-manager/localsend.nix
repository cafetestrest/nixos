{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.localsend;
in
{
  options = {
    module.packages.localsend.enable = mkEnableOption "Enables localsend";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      localsend
    ];
  };
}
