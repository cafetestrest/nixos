{ config, lib, pkgs, inputs, ... }:

{
  imports = [ inputs.ags.homeManagerModules.default ];

  home.packages = with pkgs; [
    sassc
    (python311.withPackages (p: [ p.python-pam ]))
    socat
    imagemagick
    pavucontrol #audio
    wayshot #screen recorder
    wf-recorder #screen recorder
    swappy #screen recorder
    wl-gammactl
    brightnessctl
  ];

  programs.ags = {
    enable = true;
    configDir = ../config/ags;
    extraPackages = with pkgs; [
      libgtop
      libsoup_3
    ];
  };
}
