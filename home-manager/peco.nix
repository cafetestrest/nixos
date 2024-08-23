{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.packages.peco;
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
in
{
  options = {
    module.packages.peco.enable = mkEnableOption "Enables peco";
  };

  config = mkIf cfg.enable {

    home.packages = with pkgs; [
      peco  #bash/fish better reverse search
    ];

    programs.bash.bashrcExtra = lib.mkIf (cfgBash.enable && cfgBashrc.enable) ''
      # Function to search through history and run the selected command
      peco_select_history() {
          # Get the selected command from history
          local selected_command=$(history | cut -c 8- | ${pkgs.peco}/bin/peco --query "$READLINE_LINE")

          # If a command was selected, insert it into the current line
          if [ -n "$selected_command" ]; then
              READLINE_LINE="$selected_command"
              READLINE_POINT=$"{#READLINE_LINE}"
          fi
      }

      # Bind the function to a key (Ctrl-R in this example)
      bind -x '"\C-r": peco_select_history'
    '';

    programs.fish.interactiveShellInit = lib.mkIf cfgFish.enable ''
      bind \cr 'peco_select_history (commandline -b)'
    '';

    programs.fish.plugins = lib.mkIf cfgFish.enable [
      {
        name = "peco";
        src = pkgs.fetchFromGitHub {
          owner = "oh-my-fish";
          repo = "plugin-peco";
          rev = "refs/heads/master";
          sha256 = "${vars.sha.fishOmfPecoPluginSha256Hash}";
        };
      }
    ];
  };
}
