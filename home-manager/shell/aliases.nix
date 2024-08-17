{ config, pkgs, ... }:

{
  home.shellAliases = {
    ".." = "cd ..";
    "..." = "cd ../..";
    "...." = "cd ../../..";
    "....." = "cd ../../../..";
    "......" = "cd ../../../../..";
    cls = "clear";
    cl = "clear";
  };
}
