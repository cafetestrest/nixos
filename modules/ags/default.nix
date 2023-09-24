{ config, lib, pkgs, inputs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    inputs.ags.packages.${pkgs.system}.default      #ags flake
    (python311.withPackages (p: [ p.python-pam ]))  #for ags lockscreen
    socat
    sassc
    imagemagick
    pavucontrol #audio
    wayshot #screen recorder
    wf-recorder #screen recorder
    swappy #screen recorder
    wl-gammactl
    brightnessctl
  ];

  home-manager.users.${user} = {
    home.file = {
      # ".config/ags" = {
      #   source = ./ags;
      # };
    };
  };
}
