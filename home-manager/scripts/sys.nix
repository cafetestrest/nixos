{ config, lib, pkgs, ... }:

with lib;

let
  sys = pkgs.writeShellApplication {
    name = "sys";
    text = builtins.readFile ../../config/scripts/sys.sh;
  };

  cfg = config.module.scripts.sys;
in
{
  options = {
    module.scripts.sys.enable = mkEnableOption "Enables sys scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ sys ];

    home.shellAliases = {
      reb = "sys rebuild switch";
      r = "reb";
      # t = "sys test";
      rebuildnocache = "reb --option eval-cache false";
      upgrade = "reb --upgrade";
      # u = "upgrade";
      garbage = "sys clean";
      # garbage = "nix-collect-garbage -d && nix store optimise && sudo nix-collect-garbage -d && sudo nix store optimise";
      # g = "garbage";
    };
  };
}
