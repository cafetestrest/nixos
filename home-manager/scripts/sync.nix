{ config, pkgs, ... }:

{
  home.file = {
    "sync" = {
      source = ../../config/scripts/sync.sh;
      executable = true;
    };
  };
}
