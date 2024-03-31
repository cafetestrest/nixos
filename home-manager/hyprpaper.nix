{ inputs, pkgs, ... }:
let
  inherit (import ../variables.nix)
    username
    homeDirectory;
in
{
  home.packages = with pkgs; [ hyprpaper ];

xdg.configFile."hypr/hyprpaper.conf".text = ''
preload = ~/Public/wall/wall.png
#if more than one preload is desired then continue to preload other backgrounds
#preload = /path/to/next_image.png
# .. more preloads

#set the default wallpaper(s) seen on initial workspace(s) --depending on the number of monitors used
wallpaper = ,~/Public/wall/wall.png
#if more than one monitor in use, can load a 2nd image
#wallpaper = monitor2,/path/to/next_image.png
# .. more monitors

#enable splash text rendering over the wallpaper
splash = true

#fully disable ipc
# ipc = off
  '';
}
