{ config, lib, pkgs, vars, ... }:

let
  cursor = "mcmojave-hyprcursor";

  mcmojave-hyprcursor = with pkgs; stdenv.mkDerivation rec {
    name = "mcmojave-hyprcursor";
    src = fetchFromGitHub {
      owner = "OtaK";
      repo = "McMojave-hyprcursor";
      rev = "main";
      sha256 = "sha256-+Qo88EJC0nYDj9FDsNtoA4nttck81J9CQFgtrP4eBjk=";
    };

    installPhase = ''
      runHook preInstall

      mkdir -p $out/share/icons/mcmojave-hyprcursor
      cp -R dist/* $out/share/icons/mcmojave-hyprcursor/

      runHook postInstall
    '';

  };

  cursorPackage = mcmojave-hyprcursor;
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
