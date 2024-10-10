{ config, lib, pkgs, ... }:

with lib;

let
  startup = pkgs.writeShellApplication {
    name = "startup";
    runtimeInputs = with pkgs; [
      unstable.hypridle
      wlsunset
    ];
    text = builtins.readFile ../../config/scripts/startup.sh;
  };

  cfg = config.module.scripts.startup;
in
{
  options = {
    module.scripts.startup.enable = mkEnableOption "Enables startup scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ startup ];
  };
}
