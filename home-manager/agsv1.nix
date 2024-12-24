{ pkgs, inputs, config, lib, ... }:

with lib;

let
  cfg = config.module.bar.ags;
in
{
  options = {
    module.bar.ags.enable = mkEnableOption "Enables AGS";
  };

  imports = [
    inputs.ags.homeManagerModules.default
  ];

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      sassc
      socat
      imagemagick
      pavucontrol #audio
      wayshot #screen recorder
      wf-recorder #screen recorder
      swappy #screen recorder
      wl-gammactl
      brightnessctl
      gjs
      inotify-tools #inotifywait - reload for scss
    ];

    programs.ags = {
      enable = true;
      configDir = ../config/ags;
    };
  };
}
