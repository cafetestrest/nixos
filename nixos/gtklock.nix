{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.screen-locker.gtklock;
in
{
  options = {
    module.screen-locker.gtklock.enable = mkEnableOption "Enables GTKlock Screen locker";
  };

  config = mkIf cfg.enable {
  #   nixpkgs.overlays = [
  #     (final: prev: { 
  #       gtklock = (prev.gtklock.override {
  #       }).overrideAttrs (finalAttrs: {
  #         src = final.fetchFromGitHub {
  #           owner = "jovanlanik";
  #           repo = "gtklock";
  #           rev = "refs/heads/master";
  #           sha256 = "sha256-cu9JXPvyO//aOkN0JtaBKmDcBkt/1OxztRSVAaaXN1I=";
  #         };

  # # nix-shell -p nix-prefetch-git jq --run "nix hash to-sri sha256:\$(nix-prefetch-git --url https://github.com/jovanlanik/gtklock --quiet --rev refs/heads/master | jq -r '.sha256')"
  #         patches = [
  #           ./config/gtklockui.patch
  #         ];
  #       });
  #     })
  #   ];

    nixpkgs.overlays = [
      (final: prev: {
        gtklock = prev.gtklock.overrideAttrs (o: {
          patches = (o.patches or [ ]) ++ [
            ../config/gtklock/gtklockui.patch
          ];
        });
      })
    ];

    environment.systemPackages = with pkgs; [
      gtklock
      gtklock-userinfo-module
      gtklock-powerbar-module
    ];

    security.pam.services.gtklock = {
      text = ''
      auth include login
      '';
    };
  };
}
