{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.git;
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
in
{
  options = {
    module.packages.git.enable = mkEnableOption "Enables git";
  };

  config = mkIf cfg.enable {
    programs.git = {
      enable = true;
    };

    home.shellAliases = {
      gpl = "git pull --all";
      pull = "git pull --all";
      push = "git push";
      gs = "git status";
      ga = "git add";
      gall = "git add .";
      gr = "git reset";
      grall = "git reset .";
      gd = "git diff";
      gcl = "git clone";
      clone = "git clone";
      gch = "git checkout";
      checkout = "git checkout";
      gchall = "git checkout .";
      checkoutall = "git checkout .";
    };

    programs.bash.bashrcExtra = lib.mkIf (cfgBash.enable && cfgBashrc.enable) ''
      function gco () {
        git commit -m "$1"
      }
    '';

    programs.fish.functions = lib.mkIf cfgFish.enable {
      gco = {
        body = ''
            git commit -m "$argv"
        '';
      };
    };
  };
}
