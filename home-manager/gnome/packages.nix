{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    gnome.gnome-tweaks        #gnome tweaks app
    gnome.dconf-editor        #gnome dconf editor app
    # gnome.gnome-themes-extra  #for building orchis theme (with sassc)
    # xpad                      #sticky notes
  ];
}
