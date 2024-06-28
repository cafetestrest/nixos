{ config, pkgs, ... }:
#TODO add variables for sha256
{
  imports =
    [
      ./commands.nix
    ];

  programs.fish = {
    plugins = [
      # { name = "bobthefisher"; src = pkgs.fishPlugins.bobthefisher.src; }

      {
        name = "peco";
        src = pkgs.fetchFromGitHub {
          owner = "oh-my-fish";
          repo = "plugin-peco";
          rev = "refs/heads/master";
          sha256 = "sha256-EUoicPd+aUMlfCeo9BOuIiBlQSpPtMtMn5AUkZU3uQA=";
        };
      }

      # {
      #   name = "vcs";
      #   src = pkgs.fetchFromGitHub {
      #     owner = "oh-my-fish";
      #     repo = "plugin-vcs";
      #     rev = "refs/heads/master";
      #     sha256 = "sha256-BVQgQOnPcqIf4eqLrmuUCvZahyEDKzBgJUeppLQWjQY=";
      #   };
      # }

      {
        name = "theme-default";
        src = pkgs.fetchFromGitHub {
          owner = "oh-my-fish";
          repo = "theme-default";
          rev = "refs/heads/master";
          sha256 = "sha256-FVZhJo6BTz5Gt7RSOnXXU0Btxejg/p89AhZOvB9Xk1k=";
        };
      }
    ];
    functions = {
      fish_user_key_bindings = {
        body = ''
          bind \cr 'peco_select_history (commandline -b)'
        '';
        onEvent = "fish_user_key_bindings";
      };
    };
  };
}

# omf list                                                                                                                                                                                                      18:28:28
# Plugins
# fish-spec	omf		peco		vcs		z

# Themes
# default
