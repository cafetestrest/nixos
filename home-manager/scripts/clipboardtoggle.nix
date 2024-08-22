{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.scripts.clipboardtoggle;
in
{
  options = {
    module.scripts.clipboardtoggle.enable = mkEnableOption "Enables clipboardtoggle scripts";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/scripts/clipboardtoggle.sh" = {
        source = ../../config/scripts/clipboardtoggle.sh;
        executable = true;
      };
    };
  };
}
