{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.scripts.sync;
in
{
  options = {
    module.scripts.sync.enable = mkEnableOption "Enables sync scripts";
  };

  config = mkIf cfg.enable {
    home.file = {
      "sync" = {
        text = ''
          function symlink() {
            echo "ln -s $LOCATION $PROGRAM_LOCATION"
            ln -s $LOCATION $PROGRAM_LOCATION
          }

          function remove() {
              #checks the first letter of the argument provided to the script
              if [[ $# -ge 1 ]]; then
                  firstArgLetter="$(echo "$1" | head -c 1)"
              else
                  firstArgLetter=
              fi

              echo "rm -rf $PROGRAM_LOCATION"
              rm -rf $PROGRAM_LOCATION

              if [[ "$firstArgLetter" == "r" ]]; then
                  echo 'Remove done, exiting now.'
                  exit 0
              fi
          }

          function cmd_ags() {
              PROGRAM_LOCATION=$XDG_CONFIG_HOME/ags
              LOCATION="$FLAKE_LOCATION/config/ags"

              remove "$@"
            symlink
          }

          function cmd_kitty() {
              PROGRAM_LOCATION=$XDG_CONFIG_HOME/kitty/kitty.conf
              LOCATION="$FLAKE_LOCATION/config/terminal/kitty/kitty.conf"

              remove "$@"
            symlink
          }

          function cmd_hyprland() {
              PROGRAM_LOCATION=$XDG_CONFIG_HOME/hypr/hyprland.conf
              LOCATION="$XDG_CONFIG_HOME/hypr/hyprland.conf.bak"

              remove "$@"
            symlink
          }

          function cmd_usage() {
              cat <<-_EOF
          Usage:
              $PROGRAM ags
                  Syncs over ags config from flake config files.
              $PROGRAM ags remove
                  Removes synced files.
              $PROGRAM help
                  Show this text.
          _EOF
          }

          PROGRAM=sync
          FLAKE_LOCATION=${vars.flakeLocation}

          if [[ $# -eq 0 ]] ; then
              cmd_usage "$@"
              exit 1
          fi

          case "$1" in
              ags) shift;                                     cmd_ags "$@" ;;
              kitty) shift;                                   cmd_kitty "$@" ;;
              hyprland) shift;                                cmd_hyprland "$@" ;;
              help|--help) shift;                             cmd_usage "$@" ;;
              *)  echo "Unknown command $@, syncing ags: " && cmd_ags "$@" ;;
          esac
          exit 0

        '';
        executable = true;
      };
    };
  };
}
