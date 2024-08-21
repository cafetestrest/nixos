{ config, lib, ... }:

with lib;

let
  cfg = config.module.bar.waybar;
in
{
  options = {
    module.bar.waybar.enable = mkEnableOption "Enables Waybar overlay";
  };

  config = mkIf cfg.enable {
    nixpkgs.overlays = [
      (self: super: {
        waybar = super.waybar.overrideAttrs (oldAttrs: {
          mesonFlags = oldAttrs.mesonFlags ++ [ "-Dexperimental=true" ];  #TODO move to overlays
        });
      })
    ];
  };
}
