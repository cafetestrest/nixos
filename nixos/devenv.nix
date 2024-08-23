{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.programs.devenv;
in
{
  options = {
    module.programs.devenv.enable = mkEnableOption "Enables devenv";
  };

  config = mkIf cfg.enable {
    nix.settings = {
      trusted-users = [ "root" "${vars.user}" ];

      substituters = [
        "https://devenv.cachix.org"
      ];
      trusted-public-keys = [
        "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw="
      ];
    };

    # required for port 80, traefik stopping otherwise
    # boot.kernel.sysctl."net.ipv4.ip_unprivileged_port_start" = 0;
    # networking.firewall.allowedTCPPorts = [ 80 ];
    # networking.firewall.allowedUDPPorts = [ 80 ];

    networking.extraHosts = #TODO move to users config
    ''
      127.0.0.1 ::1 magento2.rooter.test
      127.0.0.1 ::1 test.rooter.test
      127.0.0.1 ::1 rooter.rooter.test
      127.0.0.1 ::1 magento2.test
    '';
  };
}
