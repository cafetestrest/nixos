{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.ripgrep;
in
{
  options = {
    module.packages.ripgrep.enable = mkEnableOption "Enables ripgrep";
  };

  config = mkIf cfg.enable {
    programs.ripgrep = {
      enable = true;
    };

    home.shellAliases = {
      grep = "rg";
    };
  };
}
