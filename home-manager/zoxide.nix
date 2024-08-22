{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.zoxide;
in
{
  options = {
    module.packages.zoxide.enable = mkEnableOption "Enables zoxide";
  };

  config = mkIf cfg.enable {
    programs.zoxide = {
      enable = true;
      enableFishIntegration = true;
      enableBashIntegration = true;
    };
  };
}
