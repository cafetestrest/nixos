{ lib, config, pkgs, ... }:

with lib;

let
  cfg = config.module.virtualisation.virt-manager;
in
{
  options = {
    module.virtualisation.virt-manager.enable = mkEnableOption "Enables virt-manager";
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      virt-viewer               # vm
    ];

    # Manage the virtualisation services (added 2-apr-2023) TODO separate libvirtd from qemu
    virtualisation = {
      libvirtd = {
        enable = true;
        qemu = {
          swtpm.enable = true;
          ovmf.enable = true;
          ovmf.packages = [ pkgs.OVMFFull.fd ];
        };
      };
      spiceUSBRedirection.enable = true;
    };

    programs.virt-manager.enable = true;
  };
}
