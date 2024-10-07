{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.phpstorm;
in
{
  options = {
    module.packages.phpstorm.enable = mkEnableOption "Enables phpstorm";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      jetbrains.phpstorm    #phpstorm PHP editor
      # postman             #postman for API calls
    ];

    # home.shellAliases = {
    #   # www = "cd ~/Sites";
    #   # storm = "pstorm";
    #   # phpstorm = "pstorm";
    # };
  };
}
