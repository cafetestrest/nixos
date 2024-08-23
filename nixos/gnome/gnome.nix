{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.desktop-environment.gnome;
in
{
  options = {
    module.desktop-environment.gnome.enable = mkEnableOption "Enables GNOME DE";
  };

  config = mkIf cfg.enable {
    services.xserver.desktopManager.gnome.enable = true;  # Enable the GNOME Desktop Environment.

    # usb automount
    services.gvfs.enable = true;
  };
}
