{ pkgs, inputs, ... }:

{
  imports = [
    inputs.ags.homeManagerModules.default
  ];

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
}
