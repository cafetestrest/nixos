{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.eza;
in
{
  options = {
    module.packages.eza.enable = mkEnableOption "Enables eza";
  };

  config = mkIf cfg.enable {
    programs.eza = {
      enable = true;
      icons = "auto";
      git = true;

      extraOptions = [
        "--group"
        "--group-directories-first"
        "--header"
        "--no-permissions"
        "--octal-permissions"
      ];
    };
  };
}
