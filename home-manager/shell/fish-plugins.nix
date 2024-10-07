{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish.plugins;
in
{
  options = {
    module.shell.fish.plugins.enable = mkEnableOption "Enables fish plugins";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      plugins = [
        { name = "tide"; src = pkgs.fishPlugins.tide.src; }

        # {
        #   name = "vcs";
        #   src = pkgs.fetchFromGitHub {
        #     owner = "oh-my-fish";
        #     repo = "plugin-vcs";
        #     rev = "refs/heads/master";
        #     sha256 = "${vars.sha.fishOmfVcsPluginSha256Hash}";
        #   };
        # }

        # {
        #   name = "theme-default"; #⋊> ~/nixos on main ◦
        #   src = pkgs.fetchFromGitHub {
        #     owner = "oh-my-fish";
        #     repo = "theme-default";
        #     rev = "refs/heads/master";
        #     sha256 = "${vars.sha.fishOmfThemeDefaultSha256Hash}";
        #   };
        # }
      ];
    };

    home.activation.configure-tide = lib.hm.dag.entryAfter ["writeBoundary"] ''
      ${pkgs.fish}/bin/fish -c "tide configure --auto --style=Lean --prompt_colors='True color' --show_time='24-hour format' --lean_prompt_height='One line' --prompt_spacing=Compact --icons='Few icons' --transient=No"
    '';
  };
}

# omf list                                                                                                                                                                                                      18:28:28
# Plugins
# fish-spec	omf		peco		vcs		z

# Themes
# default
