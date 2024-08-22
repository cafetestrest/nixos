{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.micro;
in
{
  options = {
    module.packages.micro.enable = mkEnableOption "Enables micro";
  };

  config = mkIf cfg.enable {
    programs.micro = {
      enable = true;

      settings = {
        autosu = true; # Automatically escalates the user's privileges to superuser (root) when necessary
        diffgutter = true; # Enables a gutter that displays line-by-line diffs when editing a file under version control
        paste = true; # Allows the editor to handle paste operations differently, typically to better handle multi-line pastes
        rmtrailingws = true; # Removes trailing whitespace from lines when a file is saved
        savecursor = true; # Saves the cursor position when you close a file and restores it when the file is reopened
        saveundo = true; # Preserves the undo history across sessions
        scrollbar = true; # Displays a scrollbar on the side of the editor
        scrollbarchar = "░"; # Sets the character used for the scrollbar
        scrollmargin = 4; # Defines the number of lines above and below the cursor that should remain visible when scrolling
        scrollspeed = 1; # Sets the speed of scrolling
        statusformatl = "$(filename) @($(line):$(col)) $(modified)| $(opt:filetype) $(opt:encoding)";
        # eofnewline = false;
        clipboard = "terminal";
      };
    };

    xdg.configFile."micro/bindings.json" = {
      source = ../config/editor/micro/bindings.json;
    };

    home = {
      sessionVariables = {
        EDITOR = "micro";
        VISUAL = "micro";
      };
    };
  };
}
