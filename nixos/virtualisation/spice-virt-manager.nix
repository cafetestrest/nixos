{ lib, config, pkgs, ... }:

with lib;

let
  cfg = config.module.virtualisation.spice-virt-manager;
in
{
  options = {
    module.virtualisation.spice-virt-manager.enable = mkEnableOption "Enables interaction with virtualized desktop devices";
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      spice                     # vm
      spice-gtk                 # vm
      spice-protocol            # vm
      #win-virtio               # vm windows stuff
      #win-spice                # vm windows stuff
    ];

    virtualisation = {
      spiceUSBRedirection.enable = true;
    };

    services.spice-vdagentd.enable = false;
  };
}
