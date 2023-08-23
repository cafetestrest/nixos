{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user
    homeDirectory;
in
{
  nixpkgs.overlays = [
    (final: prev: { 
      gtklock = (prev.gtklock.override {
      }).overrideAttrs (finalAttrs: {
        src = final.fetchFromGitHub {
          owner = "jovanlanik";
          repo = "gtklock";
          rev = "refs/heads/master";
          sha256 = "sha256-nIm7ivrZPBKMs4e6iRVNpmCxwGZIyf2YWSHbSM5xKnk=";
        };

        patches = [
          ./config/patch.patch
        ];
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
      ".config/gtklock/style.css" = {
        source = ./config/gtklock/style.css;
      };
      ".config/gtklock/gtklock.ui" = {
        source = ./config/gtklock/gtklock.ui;
      };

# ; time-format=%a %b %-d  %R:%S
    ".config/gtklock/config.ini".text = ''
[main]
modules=/run/current-system/sw/lib/gtklock/powerbar-module.so;/run/current-system/sw/lib/gtklock/userinfo-module.so
time-format=%R
layout=${homeDirectory}/.config/gtklock/gtklock.ui

[userinfo]
under-clock=true
image-size=128
no-round-image=false
horizontal-layout=false

[powerbar]
show-labels=false
linked-buttons=false
    '';
    };
  };

  security.pam.services.gtklock = {
    text = ''
     auth include login
    '';
  };
}
