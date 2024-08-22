{ config, lib, pkgs, ... }:

with lib;

let
  wakefromsleep = pkgs.writeShellApplication {
    name = "wakefromsleep";
    runtimeInputs = with pkgs; [
      bc
    ];
    text = builtins.readFile ../../config/scripts/wakefromsleep.sh;
  };

  cfg = config.module.scripts.wakefromsleep;
in
{
  options = {
    module.scripts.wakefromsleep.enable = mkEnableOption "Enables wakefromsleep scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ wakefromsleep ];
  };
}
