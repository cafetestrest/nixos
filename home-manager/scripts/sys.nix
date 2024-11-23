{ config, lib, pkgs, vars, ... }:

with lib;

let
  sys = pkgs.writeShellScriptBin "sys" ''
    FLAKE_LOCATION=${vars.flakeLocation}

    function get_flake_location() {
        HAS_PATH_ARGUMENT=""

        if [[ $# -ge 1 ]] ; then
            PATH_ARGUMENT="$1"

            if [[ "$PATH_ARGUMENT" =~ ^(\.|~|/) ]]; then
                FLAKE_LOCATION="$1"
                HAS_PATH_ARGUMENT="true"
            fi
        fi
    }

    function get_rebuild_command() {
        if [[ "$OSTYPE" == "linux"* ]]; then
            REBUILD_COMMAND="nixos-rebuild"
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            REBUILD_COMMAND=darwin-rebuild
        fi

        get_flake_location "$@"
    }

    function cmd_rebuild() {
        get_rebuild_command "$@"

        # --print-build-logs
        "$REBUILD_COMMAND" --flake "$FLAKE_LOCATION#$USER" "$@" --use-remote-sudo
    }

    function cmd_test() {
        get_rebuild_command "$@"

        "$REBUILD_COMMAND" test --flake "$FLAKE_LOCATION#$USER" "$@" --use-remote-sudo
    }

    function cmd_update() {
        get_flake_location "$@"

        cd $FLAKE_LOCATION

        if [ $# -ge 1 ]; then
            for arg in "$@"; do
                if [ "$HAS_PATH_ARGUMENT" == "true" ]; then
                    HAS_PATH_ARGUMENT=""
                    continue
                fi
                sudo nix flake update "$arg"
            done
        else
            sudo nix flake update
        fi
    }

    function cmd_clean() {
        nix store optimise --verbose
        nix store gc --verbose
    }

    function cmd_garbage() {
        nix-collect-garbage -d
        nix store optimise
        sudo nix-collect-garbage -d
        sudo nix store optimise
    }

    function cmd_repair() {
        sudo nix-store --verify --check-contents --repair
    }

    function cmd_usage() {
        cat <<-_EOF
    Usage:
        $PROGRAM rebuild
            Rebuild the system. (You must be in the system flake directory!)
            Must be run as root.
        $PROGRAM test
            Like rebuild but faster and not persistent.
        $PROGRAM update [input]
            Update all inputs or the input specified. (You must be in the system flake directory!)
            Must be run as root.
        $PROGRAM clean
            Garbage collect and optimise the Nix Store.
        $PROGRAM garbage
            Garbage collect and optimise the Nix Store using nix-collect-garbage.
            Must be run as root.
        $PROGRAM repair
            Verify, check contents and repair broken links in Nix Store.
            Must be run as root.
        $PROGRAM help
            Show this text.
    _EOF
    }

    PROGRAM=sys

    if [[ $# -eq 0 ]] ; then
        cmd_usage "$@"
        exit 1
    fi

    case "$1" in
        rebuild|r|--rebuild|--r) shift;                 cmd_rebuild "$@" ;;
        test|t|--test|--t) shift;                       cmd_test "$@" ;;
        update|u|--update|--u) shift;                   cmd_update "$@" ;;
        clean|remove|c|--clean|--remove|--c) shift;     cmd_clean "$@" ;;
        garbage|g|--garbage|--g) shift;                 cmd_garbage "$@" ;;
        repair|--repair) shift;                         cmd_repair "$@" ;;
        help|--help) shift;                             cmd_usage "$@" ;;
        *)             echo "Unknown command: " "$@" && cmd_usage "$@" ;;
    esac
    exit 0

  '';

  cfg = config.module.scripts.sys;
in
{
  options = {
    module.scripts.sys.enable = mkEnableOption "Enables sys scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ sys ];

    home.shellAliases = {
      reb = "sys rebuild switch";
      r = "reb";
      # t = "sys test";
      rebuildnocache = "reb --option eval-cache false";
      upgrade = "reb --upgrade";
      # u = "upgrade";
      garbage = "sys clean";
      # garbage = "nix-collect-garbage -d && nix store optimise && sudo nix-collect-garbage -d && sudo nix store optimise";
      # g = "garbage";
    };
  };
}
