{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user
    homeDirectory;
in
{
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
        ./config/gtklockui.patch
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
    imports =
      [
        ./config/config.nix
      ];

    home.file = {
      ".config/gtklock/style.css" = {
        source = ./config/style.css;
      };
      # ".config/gtklock/gtklock.ui" = {
      #   source = ./config/gtklock.ui;
      # };
    };
  };

  security.pam.services.gtklock = {
    text = ''
     auth include login
    '';
  };
}
