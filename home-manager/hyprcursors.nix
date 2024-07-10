{ config, lib, pkgs, vars, ... }:

let
  cursor = "McMojave";

  McMojave = with pkgs; stdenv.mkDerivation rec {
    name = "McMojave";
    src = fetchFromGitHub {
      owner = "OtaK";
      repo = "McMojave-hyprcursor";
      rev = "main";
      sha256 = "sha256-+Qo88EJC0nYDj9FDsNtoA4nttck81J9CQFgtrP4eBjk=";
    };

    installPhase = ''
      runHook preInstall

      mkdir -p $out/share/icons/McMojave
      cp -R dist/* $out/share/icons/McMojave/

      runHook postInstall
    '';

  };

  cursorPackage = McMojave;
in
{
  home.packages = [
    cursorPackage
  ];

  # xdg.dataFile.".icons/${cursor}".source = "${cursorPackage}/share/icons/${cursor}";

  home.file = {
    ".icons/${cursor}" = {
      source = "${cursorPackage}/share/icons/${cursor}";
    };
  };
}
