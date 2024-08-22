{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.material-symbols;
in
{
  options = {
    module.fonts.material-symbols.enable = mkEnableOption "Enables font material-symbols";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      material-symbols                # waybar icon fonts
    ];
  };
}
