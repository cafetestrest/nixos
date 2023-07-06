# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running ‘nixos-help’).

{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user
    grubHardDrive
    timezone
    defaultLocale
    consoleFont
    initialPassword
    networkingHostName
    nixExtraOptions;
in
{
  # Overlays
  nixpkgs.overlays = [
   (import ./overlays/waybar.nix)
  ];

  networking.hostName = "${networkingHostName}";
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  # networking.networkmanager.enable = true;  # Easiest to use and most distros use this by default.

  # Enable networking
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "${timezone}";

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  i18n.defaultLocale = "${defaultLocale}";
  console = {
    font = "${consoleFont}";
    #keyMap = "us";
    useXkbConfig = true; # use xkbOptions in tty.
  };

  # Enable the X11 windowing system.
  services.xserver.enable = true;

  # Enable the GNOME Desktop Environment.
  services.xserver.displayManager.gdm.enable = true;
  # services.xserver.displayManager.gdm.settings = {
  # };
  services.xserver.desktopManager.gnome.enable = true;
  #services.xserver.displayManager.lightdm.enable = true;

  # Used to get auto login (as I'm unable to enable num lock on boot)
  # Enable automatic login for the user.
  # services.xserver.displayManager.autoLogin.enable = true;
  # services.xserver.displayManager.autoLogin.user = "${user}";

  # Workaround for GNOME autologin: https://github.com/NixOS/nixpkgs/issues/103746#issuecomment-945091229
  # systemd.services."getty@tty1".enable = false;
  # systemd.services."autovt@tty1".enable = false;

  # Slows down boot (https://github.dev/Kranzes/nix-config)
  systemd.services.NetworkManager-wait-online.enable = false;
  # For faster reboot https://unix.stackexchange.com/questions/448268/change-systemd-stop-job-timeout-in-nixos-configuration
  systemd.extraConfig = ''
    DefaultTimeoutStopSec=10s
  '';

  # Configure keymap in X11 
  # services.xserver.layout = "us";
  # services.xserver.xkbOptions = {
  #   "eurosign:e";
  #   "caps:escape" # map caps to escape.
  # };

  services.xserver = {
    layout = "us";
    xkbVariant = "";
  };

  # Enable sound with pipewire.
  sound.enable = true;
  hardware.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment this
    #jack.enable = true;

    # use the example session manager (no others are packaged yet so this is enabled by default,
    # no need to redefine it in your config for now)
    #media-session.enable = true;
  };

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # sound.enable = true;
  # hardware.pulseaudio.enable = true;

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Allow unfree packages
  nixpkgs.config.allowUnfree = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.${user} = {
    isNormalUser = true;
    extraGroups = [ "networkmanager" "wheel" "libvirtd" ]; # Enable ‘sudo’ for the user.
    initialHashedPassword = "${initialPassword}";
  };

  programs.fish.enable = true;
  programs.dconf.enable = true;           # dconf (added 1-apr-2023)

  users.defaultUserShell = pkgs.fish;

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  # services.openssh = {
  #   enable = true;

  #   openFirewall = true;
  #   permitRootLogin = "no";
  # };

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # custom
  # Used to enable numpad on start of the session (unsure if needed)
  services.xserver.displayManager.setupCommands = "/run/current-system/sw/bin/numlockx on\n";

  #required for gsconnect gnome extension to work properly (added 2-apr-2023)
  networking.firewall.allowedTCPPortRanges = [
    # KDE Connect
    { from = 1714; to = 1764; }
  ];
  networking.firewall.allowedUDPPortRanges = [
    # KDE Connect
    { from = 1714; to = 1764; }
  ];

  #allow usage of unprivileged ports
  #boot.kernel.sysctl."net.ipv4.ip_unprivileged_port_start" = 0;

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
  services.spice-vdagentd.enable = true;

  nix = {
    package = pkgs.nixFlakes;
    extraOptions = "${nixExtraOptions}";
  };

  nix.settings.auto-optimise-store = true;

  #support ntfs hard drive 29-mar-2023
  boot.supportedFilesystems = [ "ntfs" ];

  # Copy the NixOS configuration file and link it from the resulting system
  # (/run/current-system/configuration.nix). This is useful in case you
  # accidentally delete configuration.nix.
  # system.copySystemConfiguration = true;

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It‘s perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "22.11"; # Did you read the comment?
}
