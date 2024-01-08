{ config, pkgs, ... }:

{
  home.file = {
    ".config/gtklock/config.ini".text = ''
[main]
modules=/run/current-system/sw/lib/gtklock/powerbar-module.so;/run/current-system/sw/lib/gtklock/userinfo-module.so
time-format=%R

[userinfo]
under-clock=true
image-size=128
no-round-image=false
horizontal-layout=false

[powerbar]
show-labels=false
linked-buttons=false
    '';
  };
}
