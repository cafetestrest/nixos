{ config, pkgs, vars, ... }:

{
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  ];

  # TODO move to own config
  module = {
    configuration.enable = (vars.modules.configuration.enable or true);  # default value true for configuration.nix
    bootloader = {
      grub.enable = (vars.modules.bootloader.grub.enable or false);
      systemd-boot.enable = (vars.modules.bootloader.systemd-boot.enable or true);  # default value true bootload systemd-boot
    };
    drive = {
      ssd.enable = (vars.modules.drive.ssd.enable or false);
      ntfs.enable = (vars.modules.drive.ntfs.enable or false);
    };
    hardware = {
      bluetooth.enable = (vars.modules.hardware.bluetooth.enable or false);
      wireless.enable = (vars.modules.hardware.wireless.enable or false);
      amd-gpu.enable = (vars.modules.hardware.amd-gpu.enable or false);
    };
    virtualisation = {
      virt-manager.enable = (vars.modules.virtualisation.virt-manager.enable or false);
      spice-virt-manager.enable = (vars.modules.virtualisation.spice-virt-manager.enable or false);
      # docker = {
      #   enable = (vars.modules.virtualisation.docker.enable or false);
      #   warden = (vars.modules.virtualisation.warden.enable or false);
      # };
    };
    shell = {
      default-fish.enable = (vars.modules.shell.default-fish.enable or false);
    };
    window-manager = {
      hyprland.enable = (vars.modules.window-manager.hyprland.enable or false);
      plasma6.enable = (vars.modules.window-manager.plasma6.enable or false);
    #   gnome.enable = (vars.modules.window-manager.gnome.enable or true);  # default value true Gnome WM
    #   cosmic.enable = (vars.modules.window-manager.cosmic.enable or false);
    };
    # display-manager = {
    #   gdm = {
    #     enable = (vars.modules.display-manager.gdm.enable or true); # default value true GDM DM
    #     custom-background.enable = (vars.modules.display-manager.gdm.custom-background.enable or false);
    #   };
    #   sddm.enable = (vars.modules.display-manager.sddm.enable or false);
    # };
    # screen-locker = {
    #   swaylock.enable = (vars.modules.screen-locker.swaylock.enable or false);
    #   gtklock.enable = (vars.modules.screen-locker.gtklock.enable or false);
    # };
    # bar = {
    #   ags.enable = (vars.modules.bar.ags.enable or false);
    #   waybar.enable = (vars.modules.bar.waybar.enable or false);
    # };
    # services = {
    #   udev = {
    #     rangoli.enable = (vars.modules.services.udev.rangoli.enable or false);
    #   };
    #   i2c.enable = (vars.modules.services.i2c.enable or false);
    # };
    # programs = {
    #   headsetcontrol.enable = (vars.modules.programs.headsetcontrol.enable or false);
    #   devenv.enable = (vars.modules.programs.devenv.enable or false);
    #   localsend.enable = (vars.modules.programs.localsend.enable or false);
    #   chrome = {
    #     settings.enable = (vars.modules.programs.chrome.settings.enable or false);
    #   };
    #   teamviewer.enable = (vars.modules.programs.teamviewer.enable or false);
    #   copyq.enable = (vars.modules.programs.copyq.enable or false);
    #   doas.enable = (vars.modules.programs.doas.enable or false);
    # };
  };
}
