{ config, pkgs, lib, ... }:

with lib;

let
  cfg = config.module.shell.fish;
in
{
  options = {
    module.shell.fish.enable = mkEnableOption "Enables fish shell config";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      enable = true;

      # shellAliases = {
      #   nix-shell = "nix-shell --run fish";
      # };

      shellInit = ''
        set -g theme_powerline_fonts yes
        set -g theme_nerd_fonts no
        set -g fish_prompt_pwd_dir_length 0

        #sets fish colors to default
        set -U fish_color_normal normal
        set -U fish_color_command 005fd7 purple
        set -U fish_color_param 00afff cyan
        set -U fish_color_redirection normal
        set -U fish_color_comment red
        set -U fish_color_error red --bold
        set -U fish_color_escape cyan
        set -U fish_color_operator cyan
        set -U fish_color_quote brown
        set -U fish_color_autosuggestion 555 yellow
        set -U fish_color_valid_path --underline
        set -U fish_color_cwd green
        set -U fish_color_cwd_root red
        set -U fish_color_match cyan
        set -U fish_color_search_match --background=purple
        set -U fish_pager_color_prefix cyan
        set -U fish_pager_color_completion normal
        set -U fish_pager_color_description 555 yellow
        set -U fish_pager_color_progress cyan
        set -U fish_color_history_current cyan
      '';

      functions = {
        cx = {
          body = ''
            if [ (count $argv) -gt 0 ]
                cd $argv
                l
            else
                l
            end
          '';
        };

        create = {
          body = ''
            mkdir -p (dirname "$arg")
            touch "$arg"
          '';
        };

        # xkill = {
        #   body = ''
        #     if [ (count $argv) -gt 0 ]
        #       kill -9 (ps ax | grep arg | awk '{print $1}')
        #     else
        #       echo "Please add an argument which process name you would like to kill."
        #     end
        #   '';
        # };
      };
    };
  };
}
