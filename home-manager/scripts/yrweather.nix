{ config, lib, pkgs, ... }:

with lib;

let
  yrweather = pkgs.writeShellApplication {
    name = "yrweather";
    runtimeInputs = with pkgs; [
      bc
      jq
    ];
    text = builtins.readFile ../../config/scripts/yrweather.sh;
  };

  cfg = config.module.scripts.yrweather;
in
{
  options = {
    module.scripts.yrweather.enable = mkEnableOption "Enables yrweather scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ yrweather ];
  };
}
