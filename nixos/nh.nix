{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.programs.nh;
in
{
  options = {
    module.programs.nh.enable = mkEnableOption "Enables nh os rebuild command";
  };

  config = mkIf cfg.enable {
    programs.nh = {
      enable = true;
      flake = "${vars.flakeLocation}";
    };
  };
}
