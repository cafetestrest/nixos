{ config, vars, pkgs, ... }:

{
  imports = [
    ./overlays/pkgsOverlay.nix                      # pkgs overlays (stable, unstable, old...)
    ./overlays/waybar.nix
    ./bootloader/systemd-boot.nix                   # Boot and Bootloader config
    ./bootloader/grub.nix
    ./ssd.nix                                       # fstrim
    ./ntfs.nix                                      # windows ntfs file partition support
    ./bluetooth.nix                                 # bluetooth support and blueman
    ./wireless.nix
    ./amd-gpu.nix                     # configuration for AMD GPU
    ./opengl.nix
    ./hosts/shared/configuration.nix                # default configuration with defined vars
    ./hosts/shared/packages.nix                     # shared packages - vim
    ./shell/fish.nix                                # enables fish
    ./shell/fishdefaultshell.nix                    # sets default shell (fish)
    ./security/polkit.nix                           # polkit-gnome-authentication-agent
    ./hyprland.nix                                  # hyprland packages
    ./xdg.nix                                       # xdg portal
    ./kde/plasma.nix                                # KDE plasma DE
    ./gnome/gnome.nix
    ./gnome/auto-login.nix                          # Gnome automatic login
    # ./cosmic/cosmic.nix
    ./gdm/gdm.nix
    ./gdm/background.nix                            # background for gdm
    ./swaylock.nix                                  # lockscreen packages
    ./gtklock.nix                                   # lockscreen packages
    ./docker/docker.nix                             # docker, docker-compose and /etc/hosts
    ./docker/xdebug.nix                             # xdebug ports
    ./docker/warden.nix
    ./udev/headsetcontrol.nix                       # used to retrieve battery percentage from headset - udev rules
    ./udev/rangoli.nix                              # needs distrobox from home-manager
    ./devenv.nix                                    # required for https://github.com/run-as-root/rooter
    ./virtualisation/virtualisation.nix             # libvirtd
    ./virtualisation/qemu.nix                       # virt-manager packages
    ./virtualisation/spice-virt-manager.nix         # tools for VM copy/paste clipboard
    ./localsend.nix                                 # used for file sharing with other PC/mobile devices
    ./chromesettings.nix                            # chrome settings -> enables WideVine
    ./teamviewer.nix
    ./copyq.nix
    ./ydotool.nix
    ./i2c.nix                                       # for ddcutil (monitor control)
    ./doas.nix                                      # replace sudo with doas
    ./extraHosts.nix                                # extra host entries for the /etc/hosts file
  ];

  module = {
    configuration.enable = (vars.modules.configuration.enable or true);  # default value true for configuration.nix
    overlay = {
      pkgs.enable = (vars.modules.overlay.pkgs.enable or true); # default value true for pkgs overlays (stable, unstable, old...)
      waybar.enable = (vars.modules.overlay.waybar.enable or false);
    };
    bootloader = {
      grub.enable = (vars.modules.bootloader.grub.enable or false);
      systemd-boot.enable = (vars.modules.bootloader.systemd-boot.enable or true);  # default value true bootload systemd-boot
    };
    gtk = {
      cursorPackage = (vars.gtk.cursorPackage or pkgs.apple-cursor);
    };
    drive = {
      ssd.enable = (vars.modules.drive.ssd.enable or false);
      ntfs.enable = (vars.modules.drive.ntfs.enable or false);
    };
    hardware = {
      bluetooth = {
        enable = (vars.modules.hardware.bluetooth.enable or false);
        blueman.enable = (vars.modules.hardware.bluetooth.blueman.enable or false);
      };
      wireless.enable = (vars.modules.hardware.wireless.enable or false);
      amd-gpu.enable = (vars.modules.hardware.amd-gpu.enable or false);
      opengl.enable = (vars.modules.hardware.opengl.enable or false);
    };
    virtualisation = {
      enable = (vars.modules.virtualisation.enable or false);
      virt-manager.enable = (vars.modules.virtualisation.virt-manager.enable or false);
      spice-virt-manager.enable = (vars.modules.virtualisation.spice-virt-manager.enable or false);
      docker = {
        enable = (vars.modules.virtualisation.docker.enable or false);
        warden.enable = (vars.modules.virtualisation.docker.warden.enable or false);
        xdebug-ports.enable = (vars.modules.virtualisation.docker.xdebug-ports.enable or false);
      };
    };
    shell = {
      fish.enable = (vars.modules.shell.fish.enable or false);
      default-fish.enable = (vars.modules.shell.default-fish.enable or false);
    };
    xdg.enable = (vars.modules.xdg.enable or false);
    desktop-environment = {
      hyprland = {
        enable = (vars.modules.desktop-environment.hyprland.enable or false);
        services.enable = (vars.modules.desktop-environment.hyprland.services.enable or false);
      };
      plasma6.enable = (vars.modules.desktop-environment.plasma6.enable or false);
      gnome = {
        enable = (vars.modules.desktop-environment.gnome.enable or true);  # default value true Gnome WM
        auto-login.enable = (vars.modules.desktop-environment.gnome.auto-login.enable or false);
      };
      # cosmic.enable = (vars.modules.desktop-environment.cosmic.enable or false);
    };
    display-manager = {
      gdm = {
        enable = (vars.modules.display-manager.gdm.enable or true); # default value true GDM DM
        custom-background.enable = (vars.modules.display-manager.gdm.custom-background.enable or false);
        backgroundImagePath = (vars.modules.display-manager.gdm.backgroundImagePath or "");
      };
    };
    screen-locker = {
      swaylock.enable = (vars.modules.screen-locker.swaylock.enable or false);
      gtklock.enable = (vars.modules.screen-locker.gtklock.enable or false);
    };
    security = {
      polkit.enable = (vars.modules.security.polkit.enable or false);
    };
    security = {
      doas.enable = (vars.modules.security.doas.enable or false);
    };
    # bar = {};
    services = {
      udev = {
        rangoli.enable = (vars.modules.services.udev.rangoli.enable or false);
        headsetcontrol.enable = (vars.modules.services.udev.headsetcontrol.enable or false);
      };
      i2c.enable = (vars.modules.services.i2c.enable or false);
    };
    programs = {
      devenv.enable = (vars.modules.programs.devenv.enable or false);
      localsend.enable = (vars.modules.programs.localsend.enable or false);
      chrome = {
        widevine.enable = (vars.modules.programs.chrome.widevine.enable or false);
      };
      teamviewer.enable = (vars.modules.programs.teamviewer.enable or false);
      copyq.enable = (vars.modules.programs.copyq.enable or false);
      ydotool.enable = (vars.modules.programs.ydotool.enable or false);
      extraHosts = (vars.modules.programs.extraHosts or "");
    };
  };
}
