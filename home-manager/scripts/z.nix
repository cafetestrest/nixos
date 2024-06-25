{ config, pkgs, ... }:

{
  xdg = {
    configFile = {
      "scripts/z".source = fetchGit {
        url = "https://github.com/rupa/z";
        rev = "d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd";
      };
    };
  };
}
