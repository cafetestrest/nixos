{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.shell.aliases;
in
{
  options = {
    module.shell.aliases.enable = mkEnableOption "Enables shell aliases";
  };

  config = mkIf cfg.enable {
    home.shellAliases = {
      ".." = "cd ..";
      "..." = "cd ../..";
      "...." = "cd ../../..";
      "....." = "cd ../../../..";
      "......" = "cd ../../../../..";
      cls = "clear";
      cl = "clear";
    };
  };
}
