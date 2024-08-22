{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    gnomeExtensions.blur-my-shell
  ];

  dconf.settings = {
    "org/gnome/shell/extensions/pop-shell" = {
      active-hint=false;
      active-hint-border-radius=''uint32 16'';
      gap-inner=''uint32 2'';
      gap-outer=''uint32 2'';
      smart-gaps=true;
      snap-to-grid=true;
      tile-by-default=false;
    };
  };
}
