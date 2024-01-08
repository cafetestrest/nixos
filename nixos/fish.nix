{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    fish
    peco                      #for oh-my-fish (along with omf plugin)
    oh-my-fish          #fish extensions (plugins: z, peco, vcs) (themes: default)
  ];

  programs.fish.enable = true;
  users.defaultUserShell = pkgs.fish;
}
