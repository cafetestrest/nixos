{ config, lib, pkgs, ... }:

with lib;

let
  note = pkgs.writeShellApplication {
    name = "note";
    text = builtins.readFile ../../config/scripts/note.sh;
  };

  cfg = config.module.scripts.note;
in
{
  options = {
    module.scripts.note.enable = mkEnableOption "Enables note scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ note ];
  };
}
