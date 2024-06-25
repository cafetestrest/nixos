{ config, pkgs, ... }:

{
  home.file = {
    ".config/scripts/resetbluetoothags.js" = {
      source = ../../config/scripts/resetbluetoothags.js;
    };
  };
}
