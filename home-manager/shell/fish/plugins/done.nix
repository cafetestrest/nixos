{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish.plugins.done;
in
{
  options = {
    module.shell.fish.plugins.done.enable = mkEnableOption "Enables done fish plugin";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      plugins = [
        { name = "done"; src = pkgs.fishPlugins.done.src; }
      ];
    };
  };
}
