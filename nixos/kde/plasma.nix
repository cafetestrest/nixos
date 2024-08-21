{ config, lib, ... }:

with lib;

let
  cfg = config.module.desktop-environment.plasma6;
in
{
  options = {
    module.desktop-environment.plasma6.enable = mkEnableOption "Enables the KDE Plasma 6 DE";
  };

  config = mkIf cfg.enable {
    services.desktopManager.plasma6.enable = true;  # Enable the KDE Plasma Desktop Environment.
    # services.displayManager.defaultSession = "plasma";#TODO add config flag
  };
}
