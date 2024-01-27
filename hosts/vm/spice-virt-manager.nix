{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    spice                     # vm
    spice-gtk                 # vm
    spice-protocol            # vm
    #win-virtio               # vm windows stuff
    #win-spice                # vm windows stuff
  ];

  services.spice-vdagentd.enable = false;
}
