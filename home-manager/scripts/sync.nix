{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.scripts.sync;
in
{
  options = {
    module.scripts.sync.enable = mkEnableOption "Enables sync scripts";
  };

  config = mkIf cfg.enable {
    home.file = {
      "sync" = {
        source = ../../config/scripts/sync.sh;
        executable = true;
      };
    };
  };
}
