{ config, ... }:

{
  imports = [
    ./bootloader/systemd-boot.nix                   # Boot and Bootloader config
    ./bootloader/grub.nix
    ./ssd.nix                                       # fstrim
    ./ntfs.nix                                      # windows ntfs file partition support
    ./bluetooth.nix                                 # bluetooth support and blueman
    ./wireless.nix
    ./hosts/desktop/amd-gpu.nix                     # configuration for AMD GPU
    ./hosts/configuration.nix                       # shared configuration
    ./hosts/packages.nix                            # shared packages # TODO separate and add config here too, this one should be sharedPackages 
    ./fishdefaultshell.nix                          # sets default shell (fish)
    ./hyprland.nix                                  # hyprland packages
    ./kde/plasma.nix                                # KDE plasma DE
    ./gnome/gnome.nix
    # ./cosmic/cosmic.nix
    ./gdm/gdm.nix
    ./gdm/background.nix                            # background for gdm
    ./swaylock.nix                                  # lockscreen packages
    ./gtklock.nix                                   # lockscreen packages
    ./docker/docker.nix                             # docker, docker-compose and /etc/hosts
    ./docker/warden.nix
    ./udev/headsetcontrol.nix                       # used to retrieve battery percentage from headset - udev rules
    ./udev/rangoli.nix                              # needs distrobox from home-manager
    ./waybar.nix
    ./devenv.nix                                    # required for https://github.com/run-as-root/rooter
    ./hosts/vm/packages.nix                         # virt-manager packages and libvirtd
    ./hosts/vm/spice-virt-manager.nix               # tools for VM copy/paste clipboard
    ./localsend.nix                                 # used for file sharing with other PC/mobile devices
    ./chromesettings.nix                            # chrome settings -> enables WideVine
    ./teamviewer.nix
    ./copyq.nix
    ./ydotool.nix
    ./i2c.nix                                       # for ddcutil (monitor control)
    ./doas.nix                                      # replace sudo with doas
  ];
}
