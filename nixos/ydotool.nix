{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.programs.ydotool;
  cfgCopyq = config.module.programs.copyq;
in
{
  options = {
    module.programs.ydotool.enable = mkEnableOption "Enables ydotool";
  };

  config = mkIf (cfg.enable || cfgCopyq.enable) {
    programs.ydotool.enable = true;

    users.users.${vars.user} = {
      extraGroups = [
        "ydotool" #TODO remove on 24.11
      ];
    };
  };
}
