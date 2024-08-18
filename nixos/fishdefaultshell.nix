{ config, pkgs, vars, ... }:

{
  # users.defaultUserShell = pkgs.fish;

  users.users.${vars.user} = {
    shell = pkgs.fish;
    useDefaultShell = true;
  };

  programs.fish = {
    enable = true;
  };
}
