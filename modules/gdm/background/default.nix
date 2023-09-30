{ config, pkgs, ... }:

let
  inherit (import ../../../variables.nix)
    user;
in
{
  # GNOME login screen patch
  nixpkgs = {
    overlays = [
      (self: super: {
        gnome = super.gnome.overrideScope' (selfg: superg: {
          gnome-shell = superg.gnome-shell.overrideAttrs (old: {
            patches = (old.patches or []) ++ [
              (pkgs.substituteAll {
                backgroundColour = "#d94360";
                src = ./gnome-shell.patch;
              })
            ];
          });
        });
      })
    ];
  };

  services.xserver.desktopManager.gnome.extraGSettingsOverrides = ''
  [com.ubuntu.login-screen]
  background-repeat='no-repeat'
  background-size='cover'
  background-color='#777777'
  background-picture-uri='file:///etc/nixos/background.jpg'
  '';
}
