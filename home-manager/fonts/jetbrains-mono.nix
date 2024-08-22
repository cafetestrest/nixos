{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.jetbrains-mono;
in
{
  options = {
    module.fonts.jetbrains-mono.enable = mkEnableOption "Enables font jetbrains-mono";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      jetbrains-mono
    ];
  };
}
