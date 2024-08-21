{ config, lib, ... }:

with lib;

let
  cfg = config.module.services.i2c;
in
{
  options = {
    module.services.i2c.enable = mkEnableOption "Enables i2c for monitor control";
  };

  config = mkIf cfg.enable {
    hardware.i2c.enable = true; #for ddcutil (monitor control)
  };
}
