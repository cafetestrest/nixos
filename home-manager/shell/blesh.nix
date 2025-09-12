{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.shell.bash.blesh;
  cfgBash = config.module.shell.bash;
in
{
  options = {
    module.shell.bash.blesh.enable = mkEnableOption "Enables blesh package for bash";
  };

  config = mkIf (cfg.enable && cfgBash.enable) {
    home.packages = with pkgs; [
      blesh
    ];

    programs.bash = {
      bashrcExtra = ''
        [[ $- == *i* ]] && source -- "$(blesh-share)"/ble.sh --attach=none
        [[ ! ''${BLE_VERSION-} ]] || ble-attach
      '';
    };
  };
}
