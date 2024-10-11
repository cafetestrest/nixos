{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish.plugins.sponge;
in
{
  options = {
    module.shell.fish.plugins.sponge.enable = mkEnableOption "Enables sponge fish plugin";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      # keeps your fish shell history clean from typos, incorrectly used commands and everything you don't want to store due to privacy reasons
      plugins = [
        { name = "sponge"; src = pkgs.fishPlugins.sponge.src; }
      ];
    };
  };
}
