{ pkgs, ... }:

{
  # Enable bluetooth
  hardware.bluetooth = {
    enable = true;
    settings.General.Experimental = true;
  };

  services.blueman.enable = true;
}
