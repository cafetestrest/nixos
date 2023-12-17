{ config, lib, pkgs, ... }:
{
  environment.systemPackages = let
    warden = with pkgs; stdenv.mkDerivation rec {
      name = "warden";

      installPhase = ''
        mkdir -p $out/bin
        cp $src/bin/warden $out/bin/warden
        cp -r $src/config $out/
        cp -r $src/docker $out/
        cp -r $src/environments $out/
        cp -r $src/utils $out/
        cp $src/version $out/

        mkdir -p $out/commands
        cp -r commands/ $out/
      '';

      src = fetchFromGitHub {
        owner = "wardenenv";
        repo = "warden";
        rev = "main";
        sha256 = "sha256-GK27z72n3jTU5BQN79MITi5qtICDWfO1tYg5gVcOz+4=";
      };

      patches = [ ./patch/warden-svc-up-detach.patch ];
    };
  in
  [
    warden
  ];
}
