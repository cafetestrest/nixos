{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.yazi;
in
{
  options = {
    module.packages.yazi.enable = mkEnableOption "Enables yazi";
  };

  config = mkIf cfg.enable {
    programs.yazi = {
      enable = true;
    };

    home.shellAliases = {
      f = "yazi";
    };
  };
}
