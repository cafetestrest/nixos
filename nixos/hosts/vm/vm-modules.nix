{ desktop }:

rec {
  user = "test";
  flakeLocation = "/home/${user}/nixos";
  networkingHostName = "nixos";
  timezone = "America/New_York";
  defaultLocale = "en_GB.UTF-8";
  consoleFont = "Lat2-Terminus16";
  initialPassword = "$y$j9T$8zHiYDS6ygvXsdcgXn2pg1$6BkJP/RL33k.q5vUPfXyT0DelCZEt8RbUAcDysQ22A3";
  nixExtraOptions = "experimental-features = nix-command flakes";
  efiSysMountPoint = "/boot/efi";
  grubDevice = "/dev/vda";
  configurationLimit = 20;
  gtk = desktop.gtk;
  sha = desktop.sha;
  commit = desktop.commit;
  modules = {
    configuration.enable = true;  # use default configuration.nix file (if you want to use /etc/nixos/configuration.nix disable this)
    bootloader = {
      grub.enable = true;
      systemd-boot.enable = false;
    };
    virtualisation = {
      virt-manager.enable = false;
      spice-virt-manager.enable = true;
    };
    desktop-environment = {
      gnome.enable = true;
    };
    home-manager = {
      git.enable = true;
      terminator.enable = false;
    };
  };
}