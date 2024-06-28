{ config, pkgs, ... }:

let
  inherit (import ../../../variables.nix)
    fishOmfPecoPluginSha256Hash
    fishOmfVcsPluginSha256Hash
    fishOmfThemeDefaultSha256Hash;
in
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
          sha256 = "${fishOmfPecoPluginSha256Hash}";
        };
      }

      # {
      #   name = "vcs";
      #   src = pkgs.fetchFromGitHub {
      #     owner = "oh-my-fish";
      #     repo = "plugin-vcs";
      #     rev = "refs/heads/master";
      #     sha256 = "${fishOmfVcsPluginSha256Hash}";
      #   };
      # }

      {
        name = "theme-default";
        src = pkgs.fetchFromGitHub {
          owner = "oh-my-fish";
          repo = "theme-default";
          rev = "refs/heads/master";
          sha256 = "${fishOmfThemeDefaultSha256Hash}";
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
