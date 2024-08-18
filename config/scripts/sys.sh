FLAKE_LOCATION=$HOME/nixos/

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

    "$REBUILD_COMMAND" --flake "$FLAKE_LOCATION#$USER" "$@" --use-remote-sudo --print-build-logs
}

function cmd_test() {
    get_rebuild_command "$@"

    "$REBUILD_COMMAND" test --fast --flake "$FLAKE_LOCATION#$USER" "$@" --use-remote-sudo --print-build-logs
}

function cmd_update() {
    get_flake_location "$@"

    cd "${FLAKE_LOCATION}"

    if [ $# -ge 1 ]; then
        for arg in "$@"; do
            if [ "$HAS_PATH_ARGUMENT" == "true" ]; then
                HAS_PATH_ARGUMENT=""
                continue
            fi
            sudo nix flake lock --update-input "$arg"
        done
    else
        sudo nix flake update
    fi
}

function cmd_clean() {
    nix-collect-garbage -d
    nix store optimise
    sudo nix-collect-garbage -d
    sudo nix store optimise
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
    rebuild|r) shift;                   cmd_rebuild "$@" ;;
    test|t) shift;                      cmd_test "$@" ;;
    update|u) shift;                    cmd_update "$@" ;;
    clean|garbage|remove|g|c) shift;    cmd_clean "$@" ;;
    help|--help) shift;                 cmd_usage "$@" ;;
    *)  echo "Unknown command: " "$@" && cmd_usage "$@" ;;
esac
exit 0
