{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    swaylock-effects
  ];

  security.pam.services.swaylock = {
    text = ''
     auth include login
    '';
  };
}