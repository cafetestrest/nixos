{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish.omf-plugins;
in
{
  options = {
    module.shell.fish.omf-plugins.enable = mkEnableOption "Enables omf plugins";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      plugins = [
        # { name = "bobthefisher"; src = pkgs.fishPlugins.bobthefisher.src; }

        # {
        #   name = "vcs";
        #   src = pkgs.fetchFromGitHub {
        #     owner = "oh-my-fish";
        #     repo = "plugin-vcs";
        #     rev = "refs/heads/master";
        #     sha256 = "${vars.sha.fishOmfVcsPluginSha256Hash}";
        #   };
        # }

        {
          name = "theme-default";#TODO if enabled on its own config
          src = pkgs.fetchFromGitHub {
            owner = "oh-my-fish";
            repo = "theme-default";
            rev = "refs/heads/master";
            sha256 = "${vars.sha.fishOmfThemeDefaultSha256Hash}";
          };
        }
      ];
    };
  };
}

# omf list                                                                                                                                                                                                      18:28:28
# Plugins
# fish-spec	omf		peco		vcs		z

# Themes
# default
