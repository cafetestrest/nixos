{ config, lib, ... }:

with lib;

let
  cfg = config.module.scripts.resetbluetoothags;
in
{
  options = {
    module.scripts.resetbluetoothags.enable = mkEnableOption "Enables resetbluetoothags scripts";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/scripts/resetbluetoothags.js" = {
        source = ../../config/scripts/resetbluetoothags.js;
      };
    };
  };
}
