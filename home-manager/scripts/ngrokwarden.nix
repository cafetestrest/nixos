{ config, lib, pkgs, ... }:

with lib;

let
  ngrokwarden = pkgs.writeShellApplication {
    name = "ngrokwarden";
    text = builtins.readFile ../../config/scripts/ngrokwarden.sh;
  };

  cfg = config.module.scripts.ngrokwarden;
in
{
  options = {
    module.scripts.ngrokwarden.enable = mkEnableOption "Enables ngrokwarden scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ ngrokwarden ];
  };
}
