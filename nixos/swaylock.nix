{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    unstable.swaylock-effects
  ];

  security.pam.services.swaylock = {
    text = ''
     auth include login
    '';
  };

  security.pam.services.gtklock = {
    text = ''
     auth include login
    '';
  };
}
