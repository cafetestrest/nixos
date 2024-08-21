{ config, lib, ... }:

with lib;

let
  cfg = config.module.programs.chrome.widevine;
in
{
  options = {
    module.programs.chrome.widevine.enable = mkEnableOption "Enables chrome WideVine";
  };

  config = mkIf cfg.enable {
    nixpkgs.config = {
      chromium = {
        enableWideVine = true;
        # commandLineArgs = "--enable-features=UseOzonePlatform --ozone-platform=wayland";
      };
    };
  };
}
