{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  users.users.${user} = {
    packages = with pkgs; [ 
      oh-my-fish          #fish extensions (plugins: z, peco, vcs) (themes: default)
    ];
  };

  environment.systemPackages = with pkgs; [
    fish
    peco                      #for oh-my-fish (along with omf plugin)
  ];

  home-manager.users.${user} = {
    home.file = {
      ".config/fish/config.fish" = {
        source = ./config/config.fish;
      };
    };
  };

  programs.fish.enable = true;
  users.defaultUserShell = pkgs.fish;
}
