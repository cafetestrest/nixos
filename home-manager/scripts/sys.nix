{ config, pkgs, ... }:

let
  sys = pkgs.writeShellApplication {
    name = "sys";
    runtimeInputs = with pkgs; [
      sudo
    ];
    text = builtins.readFile ../../config/scripts/sys.sh;
  };
in
{
  home.packages = [ sys ];

  home.shellAliases = {
    reb = "sys rebuild switch";
    r = "reb";
    # t = "sys test";
    rebuildnocache = "reb --option eval-cache false";
    upgrade = "reb --upgrade";
    # u = "upgrade";
    garbage = "sys clean";
    # garbage = "nix-collect-garbage -d && nix store optimise && sudo nix-collect-garbage -d && sudo nix store optimise";
    # g = "garbage";
  };
}
