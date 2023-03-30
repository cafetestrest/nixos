{ config, pkgs, lib, ... }:

{
  systemd.services.numlock = {
    enable = true;
    description = "Enable numlock";
    serviceConfig = {
      Type = "forking";
      script = "setleds +num";
    };
    wantedBy = [ "multi-user.target" ];
  };
}
