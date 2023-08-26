{ config, pkgs, ... }:

let
  inherit (import ../../../variables.nix)
    user
    homeDirectory;
in
{
  home.file = {
    ".config/gtklock/config.ini".text = ''
[main]
modules=/run/current-system/sw/lib/gtklock/powerbar-module.so;/run/current-system/sw/lib/gtklock/userinfo-module.so
time-format=%R
layout=${homeDirectory}/.config/gtklock/gtklock.ui

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
