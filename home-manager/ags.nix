{ pkgs, inputs, ... }:

{
  imports = [
    inputs.ags.homeManagerModules.default
  ];

  home.packages = with pkgs; [
    sassc
    # (python311.withPackages (p: [ p.python-pam ]))
    socat
    imagemagick
    pavucontrol #audio
    wayshot #screen recorder
    wf-recorder #screen recorder
    swappy #screen recorder
    wl-gammactl
    brightnessctl
    gjs

    # bun
    # dart-sass
    # fd
    # brightnessctl
    # swww
    # inputs.matugen.packages.${system}.default
    # slurp
    # wf-recorder
    # wl-clipboard
    # wayshot
    # swappy
    # hyprpicker
    # pavucontrol
    # networkmanager
    # gtk3
  ];

  programs.ags = {
    enable = true;
    configDir = ../config/ags;
    # extraPackages = with pkgs; [
    #   libgtop
    #   libsoup_3
    # ];
  };
}
