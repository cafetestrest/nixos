{ config, pkgs, ... }:

{
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    apple-cursor
    # teamviewer
  ];

  hardware.i2c.enable = true; #for ddcutil (monitor control)

  # services.teamviewer.enable = true;
}
