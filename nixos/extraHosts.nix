{ config, lib, ... }:

with lib;

let
  cfg = config.module.programs.extraHosts;
in
{
  options = {
    module.programs.extraHosts = mkOption {
      type = types.lines;
      description = "Extra host entries for the /etc/hosts file";
      default = "";
    };
  };

  config = {
    networking.extraHosts = cfg;
  };
}
