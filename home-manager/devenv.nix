{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.devenv;
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
in
{
  options = {
    module.packages.devenv.enable = mkEnableOption "Enables devenv";
  };

  config = mkIf cfg.enable {
    programs.bash.bashrcExtra = lib.mkIf (cfgBash.enable && cfgBashrc.enable) ''
      eval "$(direnv hook bash)"
    '';

    programs.fish.shellInit = lib.mkIf cfgFish.enable ''
      direnv hook fish | source
    '';
  };
}
