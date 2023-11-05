{ config, lib, pkgs, ... }:
{
  environment.systemPackages = let
    warden = with pkgs; stdenv.mkDerivation rec {
      name = "warden";

      installPhase = ''
        mkdir -p $out/bin
        cp $src/bin/warden $out/bin/warden
        cp -r $src/commands $out/
        cp -r $src/config $out/
        cp -r $src/docker $out/
        cp -r $src/environments $out/
        cp -r $src/utils $out/
        cp $src/version $out/
      '';

      src = fetchFromGitHub {
        owner = "wardenenv";
        repo = "warden";
        rev = "main";
        sha256 = "sha256-YZN0JDPp8nvfnPPzdvLfEFufR+S/IuPL8P5FtSFQH4A=";
      };
    };
  in
  [ warden ];
}
