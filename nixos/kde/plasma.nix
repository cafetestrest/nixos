{ config, pkgs, vars, ... }:

{
  services.desktopManager.plasma6.enable = true;  # Enable the KDE Plasma Desktop Environment.
  # services.displayManager.defaultSession = "plasma";
}
