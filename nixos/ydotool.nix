{ config, pkgs, lib, vars, ... }:

{
  # programs.ydotool.enable = true;
  users.groups.ydotool = { };

  systemd.services.ydotoold = {
    description = "ydotoold - backend for ydotool";
    wantedBy = [ "multi-user.target" ];
    partOf = [ "multi-user.target" ];
    serviceConfig = {
      Group = "ydotool";
      RuntimeDirectory = "ydotoold";
      RuntimeDirectoryMode = "0750";
      ExecStart = "${lib.getExe' pkgs.ydotool "ydotoold"} --socket-path=/run/ydotoold/socket --socket-perm=0660";

      # hardening

      ## allow access to uinput
      DeviceAllow = [ "/dev/uinput" ];
      DevicePolicy = "closed";

      ## allow creation of unix sockets
      RestrictAddressFamilies = [ "AF_UNIX" ];

    };
  };

  environment.variables = {
    YDOTOOL_SOCKET = "/run/ydotoold/socket";
  };
  environment.systemPackages = with pkgs; [ ydotool ];

  users.users.${vars.user} = {
    extraGroups = [
      "ydotool"
      "input"
      "uinput"
    ];
  };
}
