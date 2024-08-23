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
      virt-viewer
    ];

    virtualisation = {
      libvirtd = {
        qemu = {
          swtpm.enable = true;
          ovmf.enable = true;
          ovmf.packages = [ pkgs.OVMFFull.fd ];
        };
      };
    };

    programs.virt-manager.enable = true;
  };
}
