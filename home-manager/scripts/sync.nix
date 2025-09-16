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
          firstArgLetter=

          function symlink() {
            if [[ ! "$firstArgLetter" =~ ^[ur]$ ]]; then
              echo "ln -s $LOCATION $PROGRAM_LOCATION"
              ln -s $LOCATION $PROGRAM_LOCATION
            fi
          }

          function remove() {
            #checks the first letter of the argument provided to the script
            if [[ $# -ge 1 ]]; then
              firstArgLetter="$(echo "$1" | head -c 1)"
            fi

            # first arg = (u)pdate / upgrade, check if already symlinked and remove it for rebuild
            if [[ "$firstArgLetter" == "u" ]]; then
              # Something exists (file, dir, or symlink)
              if [ -e "$PROGRAM_LOCATION" ] || [ -L "$PROGRAM_LOCATION" ]; then
                # symlinked program is pointing to correct location
                if [ "$(readlink -f "$PROGRAM_LOCATION")" = "$(readlink -f "$LOCATION")" ]; then
                  echo "Symlink exist, $PROGRAM_LOCATION -> $LOCATION"
                else
                  echo "Symlinked properly $PROGRAM_LOCATION. Exiting."
                  return
                fi
              else
                echo "Nothing here: $PROGRAM_LOCATION. Skipping."
                return
              fi
            fi

            echo "rm -rf $PROGRAM_LOCATION"
            rm -rf $PROGRAM_LOCATION

            if [[ "$firstArgLetter" =~ ^[ur]$ ]]; then
              echo "Removing: $PROGRAM_LOCATION"
            fi
          }

          function cmd_ags() {
            PROGRAM_LOCATION=$XDG_CONFIG_HOME/ags
            # LOCATION="$FLAKE_LOCATION/config/ags"
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

          function cmd_ghostty() {
            PROGRAM_LOCATION=$XDG_CONFIG_HOME/ghostty/config
            LOCATION="$FLAKE_LOCATION/config/terminal/ghostty/config"

            remove "$@"
            symlink
          }

          function cmd_hyprland() {
            PROGRAM_LOCATION=$XDG_CONFIG_HOME/hypr/hyprland.conf
            LOCATION="$XDG_CONFIG_HOME/hypr/hyprland.conf.bak"

            remove "$@"
            symlink
          }

          function cmd_waybar() {
            PROGRAM_LOCATION=$XDG_CONFIG_HOME/waybar/config.jsonc
            LOCATION="$FLAKE_LOCATION/config/waybar/config.jsonc"

            remove "$@"
            symlink

            PROGRAM_LOCATION=$XDG_CONFIG_HOME/waybar/style.css
            LOCATION="$FLAKE_LOCATION/config/waybar/style.css"

            remove "$@"
            symlink
          }

          function cmd_check_rebuild() {
              firstArgLetter="u"
              cmd_ags
              cmd_kitty
              cmd_ghostty
              cmd_waybar
              cmd_hyprland
              echo "Everything is prepared for rebuild."
          }

          function cmd_usage() {
              cat <<-_EOF
            Usage:
              $PROGRAM { ags | kitty | hyprland | waybar } [r | remove]
                  Syncs over ags config from flake config files.

              OPTIONS:
                remove | r
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
              ghostty) shift;                                 cmd_ghostty "$@" ;;
              waybar) shift;                                  cmd_waybar "$@" ;;
              hyprland) shift;                                cmd_hyprland "$@" ;;
              check) shift;                                   cmd_check_rebuild "$@" ;;
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
