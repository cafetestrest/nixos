{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    teamviewer
  ];

  services.teamviewer.enable = true;
}
