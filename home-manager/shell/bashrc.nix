{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
in
{
  options = {
    module.shell.bash.bashrc.enable = mkEnableOption "Enables bashrc config";
    module.shell.bash.enable = mkEnableOption "Enables bash";
  };

  config = mkIf (cfgBashrc.enable && cfgBash.enable) {
    programs.bash = {#TODO move some of the bashrcExtra to users directory
      enable = true;  #TODO add flag
      enableCompletion = true;#TODO if fastfetch is installed
      bashrcExtra = ''
        if [[ $(whoami) == "${vars.user}" && -d "$HOME/nixos" ]]; then
          cd "$HOME/nixos"
          fastfetch
        fi

        # devenv TODO
        #eval "$(direnv hook bash)"

        # history
        HISTCONTROL=ignoredups # no duplicate lines in history
        HISTSIZE=200000
        HISTFILESIZE=200000
        # HISTTIMEFORMAT='%Y/%m/%d-%H:%M	'

        # Check the window size after each command and, if necessary, update the values of LINES and COLUMNS.
        shopt -s checkwinsize
        # HIT ENTER FIRST IF LAST COMMAND IS NOT SEEN IN ANOTHER WINDOW
        # http://superuser.com/questions/37576/can-history-files-be-unified-in-bash
        # (`histappend` in `shellOptions` above is also part of this)
        #PROMPT_COMMAND="''\${PROMPT_COMMAND:+$PROMPT_COMMAND$'\n'}history -a; history -c; history -r" # help history
        shopt -s histappend # man shopt

        # . $HOME/.config/scripts/z/z.sh

        #TODO
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

        #TODO
        # Bind the function to a key (Ctrl-R in this example)
        bind -x '"\C-r": peco_select_history'

        #TODO
        function gco () {
          git commit -m "$1"
        }

        function create () {
          mkdir -p $(dirname $1)
          touch $1
        }

        #TODO
        function code () {
          if [ "$#" -gt 0 ]; then
            codium "$@"
          else
            codium .
          fi
        }

        function cx () {
          if [ "$#" -gt 0 ]; then
            cd "$@"
            l
          else
            l
          fi
        }

        function xkill {
            if [[ -n "$1" ]]; then
                kill -9 $(ps ax | grep "$1" | grep -v grep | awk '{print $1}')
            else
                echo "Please add an argument for the process name you would like to kill."
            fi
        }
      '';
    };
  };
}
