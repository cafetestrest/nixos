{ config, pkgs, ... }:
let
  inherit (import ../variables.nix)
    user
    username;
in
{
  nix.settings = {
    trusted-users = [ "root" "${user}" ];

    substituters = [
      "https://devenv.cachix.org"
    ];
    trusted-public-keys = [
      "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw="
    ];
  };

  # required for port 80, traefik stopping otherwise
  boot.kernel.sysctl."net.ipv4.ip_unprivileged_port_start" = 0;

  networking.extraHosts =
  ''
    127.0.0.1 ::1 magento2.rooter.test
  '';
}