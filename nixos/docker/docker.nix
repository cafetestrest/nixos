{ config, lib, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    docker
    docker-compose
  ];

  users.users.${user} = {
    extraGroups = [ "docker" ];
  };

  programs.ssh.extraConfig =
  ''
    ## WARDEN START ##
    Host tunnel.warden.test
    HostName 127.0.0.1
    User user
    Port 2222
    IdentityFile ~/.warden/tunnel/ssh_key
    ## WARDEN END ##
  '';

  #in case you can not open website (automatic dns resolution is not working), check if this file is present and not directory in its place
  #/.warden/etc/traefik/traefik.yml
  services.resolved = {
    enable = true;
    extraConfig = ''
      DNS=127.0.0.1
      Domains=~test
    '';
  };

  # networking.hosts = {
  #   "127.0.0.1" = [ "app.exampleproject.test" ];
  # };

  # networking = {
  #   resolvconf = {
  #     enable = true;
  #     useLocalResolver = true;
  #   };
  #   search = [ "home net" ];
  #   nameservers = [
  #     "1.1.1.1"
  #     "8.8.8.8"
  #   ];
  # };

  # xdebug ports
  networking.firewall.allowedTCPPortRanges = [
    { from = 9000; to = 9003; }
  ];
  networking.firewall.allowedUDPPortRanges = [
    { from = 9000; to = 9003; }
  ];

  virtualisation.docker.enable = true;
}
