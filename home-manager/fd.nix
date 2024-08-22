{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.fd;
in
{
  options = {
    module.packages.fd.enable = mkEnableOption "Enables fd";
  };

  config = mkIf cfg.enable {
    programs.fd = {
      enable = true;
    };

    home.shellAliases = {
      find = "fd";
    };
  };
}
