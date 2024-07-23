{ config, pkgs, ... }:

{
  home.file = {
    ".config/scripts/clipboardtoggle.sh" = {
      source = ../../config/scripts/clipboardtoggle.sh;
      executable = true;
    };
  };
}
