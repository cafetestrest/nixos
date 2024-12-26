{ config, lib, pkgs, inputs, ... }:

with lib;

let
  cfg = config.module.packages.ghostty;
in
{
  options = {
    module.packages.ghostty.enable = mkEnableOption "Enables ghostty";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      inputs.ghostty.packages.x86_64-linux.default
    ];
  };
}
