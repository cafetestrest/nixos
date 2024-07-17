{ lib, ... }:

{
  services.fstrim.enable = lib.mkDefault true;
  nix.settings.auto-optimise-store = true;
}
