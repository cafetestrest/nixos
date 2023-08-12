{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  nixpkgs.overlays = [
    (final: prev: { 
      gtklock = (prev.gtklock.override {
      }).overrideAttrs (finalAttrs: {
        src = final.fetchFromGitHub {
          owner = "jovanlanik";
          repo = "gtklock";
          rev = "refs/heads/main";
          sha256 = "sha256-b9wB7cCvFfHWxNSJJDQceSjHMivdXwAghM8/BKLQOQk=";
        };
      });
    })
  ];

  environment.systemPackages = with pkgs; [
    gtklock
    gtklock-userinfo-module
    gtklock-powerbar-module
  ];

  home-manager.users.${user} = {
    home.file = {
      ".config/gtklock/config.ini" = {
        source = ./config/gtklock/config.ini;
      };
      ".config/gtklock/style.css" = {
        source = ./config/gtklock/style.css;
      };
      ".config/gtklock/gtklock.ui" = {
        source = ./config/gtklock/gtklock.ui;
      };
    };
  };

  security.pam.services.gtklock = {
    text = ''
     auth include login
    '';
  };
}
