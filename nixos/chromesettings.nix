{ config, pkgs, ... }:

{
  nixpkgs.config = {
    chromium = {
      enableWideVine = true;
      # commandLineArgs = "--enable-features=UseOzonePlatform --ozone-platform=wayland";
    };
  };
}
