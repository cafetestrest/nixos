{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    virt-manager              # virtual manager
    virt-viewer               # vm
  ];

  # Manage the virtualisation services (added 2-apr-2023)
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
}
