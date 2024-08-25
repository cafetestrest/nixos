{ config, lib, inputs, pkgs, ... }:

with lib;

let
  cfg = config.module.overlay.pkgs;

  # overlay-old = final: prev: {
  #   old = import inputs.nixpkgs-old {
  #     system = "${prev.system}";
  #     config.allowUnfree = true;
  #   };
  # };

  overlay-stable = final: prev: {
    stable = import inputs.nixpkgs-stable {
      system = "${prev.system}";
      config.allowUnfree = true;
    };
  };

  overlay-unstable = final: prev: {
    unstable = import inputs.nixpkgs-unstable {
      system = "${prev.system}";
      config.allowUnfree = true;
    };
  };

  overlay-master = final: prev: {
    master = import inputs.nixpkgs-master {
      system = "${prev.system}";
      config.allowUnfree = true;
    };
  };

  # overlay-nur = final: prev: {
  #   nur = import inputs.nur {
  #     nurpkgs = prev;
  #     pkgs = prev;
  #   };
  # };
in
{
  options = {
    module.overlay.pkgs.enable = mkEnableOption "Enables nix pkgs overlays";
  };

  config = mkIf cfg.enable {
    nixpkgs.overlays = [
      # overlay-old
      overlay-stable
      overlay-unstable
      overlay-master
      # overlay-nur
    ];
  };
}
