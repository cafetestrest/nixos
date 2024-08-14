{ config, pkgs, ... }:

{
  hardware.i2c.enable = true; #for ddcutil (monitor control)
}
