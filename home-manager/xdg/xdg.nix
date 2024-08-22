{ pkgs, lib, config, ... }:

with lib;

let
  cfg = config.module.xdg;
in
{
  options = {
    module.xdg.enable = mkEnableOption "Enables xdg and xdg utils";
  };

  config = mkIf cfg.enable {
    # https://github.com/ryan4yin/nix-config
    home.packages = with pkgs; [
      xdg-utils # provides cli tools such as `xdg-mime` `xdg-open`
      xdg-user-dirs
    ];

    xdg = {
      enable = true;
    };
  };
}
