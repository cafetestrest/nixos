{ config, lib, pkgs, ... }:

with lib;

let
  setaudiosource = pkgs.writeShellApplication {
    name = "setaudiosource";
    # runtimeInputs = with pkgs; [wireplumber libnotify];
    text = builtins.readFile ../../config/scripts/setaudiosource.sh;
  };

  cfg = config.module.scripts.setaudiosource;
in
{
  options = {
    module.scripts.setaudiosource.enable = mkEnableOption "Enables setaudiosource scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ setaudiosource ];
  };
}
