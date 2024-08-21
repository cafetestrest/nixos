{ config, lib, ... }:

with lib;

let
  cfg = config.module.window-manager.plasma6;
in
{
  options = {
    module.window-manager.plasma6.enable = mkEnableOption "Enables the KDE Plasma 6 Desktop Environment";
  };

  config = mkIf cfg.enable {
    services.desktopManager.plasma6.enable = true;  # Enable the KDE Plasma Desktop Environment.
    # services.displayManager.defaultSession = "plasma";#TODO add config flag
  };
}
