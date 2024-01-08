{ config, lib, pkgs, ... }:
{
  environment.systemPackages = let
    warden = with pkgs; stdenv.mkDerivation rec {
      name = "warden";

      installPhase = ''
        mkdir -p $out/bin
        cp $src/bin/warden $out/bin/warden
        cp -r config $out/
        cp -r docker $out/
        cp -r utils $out/
        cp -r commands/ $out/
        cp -r environments $out/
        cp version $out/

        mkdir -p $out/environments/magento2/.warden
        cp -r ${./warden/.warden}/* $out/environments/magento2/.warden
      '';

      src = fetchFromGitHub {
        owner = "wardenenv";
        repo = "warden";
        rev = "main";
        sha256 = "sha256-GK27z72n3jTU5BQN79MITi5qtICDWfO1tYg5gVcOz+4=";
      };

      patches = [
        ./patch/warden-svc-up-detach.patch
        ./patch/warden-env-init.patch
        ./patch/env-init-file.patch
      ];
    };
  in
  [
    warden
  ];
}
