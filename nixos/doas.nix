{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.security.doas;
in
{
  options = {
    module.security.doas.enable = mkEnableOption "Enables doas";
  };

  config = mkIf cfg.enable {
    security = {
      sudo.enable = true;
      doas.enable = true;
      doas.extraRules = [
        {
          users = [ "${vars.user}" ];
          keepEnv = true;
          persist = true;
        }
      ];
    };

    environment.shellAliases = {
      sudo = "doas";
    };
  };
}
