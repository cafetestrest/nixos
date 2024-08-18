{ config, pkgs, lib, vars, ... }:

{
  programs.ydotool.enable = true;

  users.users.${vars.user} = {
    extraGroups = [
      "ydotool" #TODO remove on 24.11
    ];
  };
}
