{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish.plugins.autopair;
in
{
  options = {
    module.shell.fish.plugins.autopair.enable = mkEnableOption "Enables autopair fish plugin";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      plugins = [
        { name = "autopair"; src = pkgs.fishPlugins.autopair.src; }
      ];
    };
  };
}
