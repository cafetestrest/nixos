{ config, lib, pkgs, ... }:

with lib;

let
  exportbluetoothinfo = pkgs.writeShellApplication {
    name = "exportbluetoothinfo";
    text = builtins.readFile ../../config/scripts/exportbluetoothinfo.sh;
  };

  cfg = config.module.scripts.exportbluetoothinfo;
in
{
  options = {
    module.scripts.exportbluetoothinfo.enable = mkEnableOption "Enables exportbluetoothinfo scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ exportbluetoothinfo ];
  };
}
