{ lib, stdenv, pkgs, ... }:

let
  custom = ./custom;
in
stdenv.mkDerivation {
  pname = "ags";
  version = "1.0.0";

  src = pkgs.buildNpmPackage {
    name = "ags";
    src = pkgs.fetchFromGitHub {
      owner = "Aylur";
      repo = "ags";
      rev = "refs/heads/main";
      sha256 = "sha256-ht9kA5uNOH09xWnsnpUOZ+F2SXps605zxxip54WE420=";
      fetchSubmodules = true;
    };

    dontBuild = true;

    npmDepsHash = "sha256-e1YYtWiO/dN7w2s+En3+3gc98R/hM5pJnTK7kCCH8Mc=";

    installPhase = ''
      mkdir $out
      cp -r * $out
    '';
  };

  patches = [
    ./lib-path.patch
  ];
  
  nativeBuildInputs = with pkgs; [
    nodePackages.typescript
    meson
    pkg-config
    ninja
  ];

  buildInputs = with pkgs; [
    gobject-introspection
    nur.repos.dongsu8142.gjs
    gtk3
    libpulseaudio
  ];

  meta = with lib; {
    description = "A customizable and extensible shell for Hyprland";
    homepage = "https://github.com/Aylur/ags";
    platforms = [ "x86_64-linux" ];
    license = licenses.gpl3;
  };
}
