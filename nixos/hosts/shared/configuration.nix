# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running ‘nixos-help’).

{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.configuration;
in
{
  options = {
    module.configuration.enable = mkEnableOption "Enables Default Configuration";
  };

  config = mkIf cfg.enable {
    networking.hostName = "${vars.networkingHostName}";
    # Pick only one of the below networking options.
    # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
    networking.networkmanager.enable = true;  # Easiest to use and most distros use this by default.

    time.timeZone = "${vars.timezone}";  # Set your time zone.
    time.hardwareClockInLocalTime = true;

    # Configure network proxy if necessary
    # networking.proxy.default = "http://user:password@proxy:port/";
    # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

    i18n.defaultLocale = "${vars.defaultLocale}";  # Select internationalisation properties.
    console = {
      font = "${vars.consoleFont}";
      #keyMap = "us";
      useXkbConfig = true; # use xkbOptions in tty.
    };

    services.xserver.enable = true; # Enable the X11 windowing system.

    # systemd.services.NetworkManager-wait-online.enable = false; # Slows down boot (https://github.dev/Kranzes/nix-config)
    # For faster reboot https://unix.stackexchange.com/questions/448268/change-systemd-stop-job-timeout-in-nixos-configuration
    systemd.extraConfig = ''
      DefaultTimeoutStopSec=10s
    '';

    services.xserver.xkb = {  # Configure keymap in X11
      layout = "us";
      variant = "";
      # xkbVariant = {
      #   "eurosign:e";
      #   "caps:escape" # map caps to escape.
      # };
    };

    #sound.enable = true;  # Enable sound with pipewire.
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

    # Enable touchpad support (enabled default in most desktopManager).
    # services.xserver.libinput.enable = true;

    nixpkgs.config = {
      allowUnfree = true;  # Allow unfree packages
    };

    # Define a user account. Don't forget to set a password with ‘passwd’.
    users.users.${vars.user} = {
      isNormalUser = true;
      extraGroups = [
        "networkmanager"
        "wheel"
        # "libvirtd"
      ];
      initialHashedPassword = "${vars.initialPassword}";
    };

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

    # networking.firewall = rec {
    #   allowedTCPPortRanges = [{ from = 1714; to = 1764; }];
    #   allowedUDPPortRanges = allowedTCPPortRanges;
    # };

    #allow usage of unprivileged ports
    # boot.kernel.sysctl."net.ipv4.ip_unprivileged_port_start" = 0;

    #Linux Kernel
    # boot.kernelPackages = pkgs.linuxPackages_latest;

    nix = {
      package = pkgs.nixVersions.stable;
      extraOptions = "${vars.nixExtraOptions}";
    };

    nix.settings = {
      substituters = [
        "https://nix-community.cachix.org"
      ];
      trusted-public-keys = [
        "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
      ];
    };

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
  };
}
