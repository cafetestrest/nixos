{ config, lib, pkgs, ... }:

with lib;

{
  options = {
    module.gnome.extension.enable = mkEnableOption "Enables Gnome extension toggling";
  };
}
