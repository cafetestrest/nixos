{ config, lib, ... }:

with lib;

let
  cfg = config.module.git;
in
{
  options = {
    module.git.enable = mkEnableOption "Enables git";
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
  };
}
