{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.bat;
in
{
  options = {
    module.packages.bat.enable = mkEnableOption "Enables bat";
  };

  config = mkIf cfg.enable {
    programs.bat = {
      enable = true;
    };

    home.shellAliases = {
      cat = "bat";
    };
  };
}
