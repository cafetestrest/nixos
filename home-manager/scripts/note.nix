{ config, pkgs, ... }:

let
  note = pkgs.writeShellApplication {
    name = "note";
    text = builtins.readFile ../../config/scripts/note.sh;
  };
in
{
  home.packages = [ note ];
}
