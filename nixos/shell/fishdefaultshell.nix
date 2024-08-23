{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.default-fish;
in
{
  options = {
    module.shell.default-fish.enable = mkEnableOption "Enables fish shell as default";
  };

  config = mkIf cfg.enable {
    users.users.${vars.user} = {
      useDefaultShell = true;
    };
  };
}
