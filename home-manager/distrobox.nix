{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.distrobox;
in
{
  options = {
    module.packages.distrobox.enable = mkEnableOption "Enables distrobox";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      distrobox             #distibutions in docker container
    ];
  };
}
