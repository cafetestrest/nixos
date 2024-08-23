{ config, lib, ... }:

with lib;

let
  cfg = config.module.overlay.waybar;
in
{
  options = {
    module.overlay.waybar.enable = mkEnableOption "Enables Waybar overlay";
  };

  config = mkIf cfg.enable {
    nixpkgs.overlays = [
      (self: super: {
        waybar = super.waybar.overrideAttrs (oldAttrs: {
          mesonFlags = oldAttrs.mesonFlags ++ [ "-Dexperimental=true" ];
        });
      })
    ];
  };
}
