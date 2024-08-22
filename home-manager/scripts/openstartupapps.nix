{ config, lib, pkgs, ... }:

with lib;

let
  openstartupapps = pkgs.writeShellApplication {
    name = "openstartupapps";
    # runtimeInputs = with pkgs; [
    #   # playerctl
    # ];
    text = builtins.readFile ../../config/scripts/openstartupapps.sh;
  };

  cfg = config.module.scripts.openstartupapps;
in
{
  options = {
    module.scripts.openstartupapps.enable = mkEnableOption "Enables openstartupapps scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ openstartupapps ];
  };
}
