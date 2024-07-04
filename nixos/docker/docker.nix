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

  # networking.extraHosts =
  # ''
  #   127.0.0.1 ::1 magento.test
  #   172.17.0.1 host.docker.internal
  #   127.0.0.1 ::1 app.exampleproject.test
  #   127.0.0.1 ::1 rabbitmq.exampleproject.test
  #   127.0.0.1 ::1 opensearch.exampleproject.test
  #   127.0.0.1 ::1 elasticsearch.exampleproject.test
  #   127.0.0.1 ::1 dnsmasq.warden.test
  #   127.0.0.1 ::1 traefik.warden.test
  #   127.0.0.1 ::1 portainer.warden.test
  #   127.0.0.1 ::1 mailhog.warden.test
  # '';

  # services.resolved = {
  #   enable = true;
  #   extraConfig = ''
  #     DNS=127.0.0.1
  #     Domains=~test
  #   '';
  # };

  # networking = {
  #   resolvconf.enable = true;
  #   search = [ "home" "net" ];
  #   defaultGateway = "127.0.0.1";
  #   nameservers = [
  #     "1.1.1.1"
  #     "8.8.8.8"
  #   ];
  # };
  # environment.etc = {
  #   "resolv.conf".text = "nameserver 127.0.0.1\n";
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
