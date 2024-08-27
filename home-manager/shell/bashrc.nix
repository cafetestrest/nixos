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
    programs.bash = {
      enable = true;
      enableCompletion = true;
      bashrcExtra = ''
        export FLAKE_LOCATION="${vars.flakeLocation}"

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

        function create () {
          mkdir -p $(dirname $1)
          touch $1
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
