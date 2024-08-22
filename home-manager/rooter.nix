{ inputs, config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.rooter;
in
{
  options = {
    module.packages.rooter.enable = mkEnableOption "Enables rooter";
  };

  config = mkIf cfg.enable {
    #https://dev.to/run_as_root/good-bye-docker-hello-nix-configuring-a-magento-2-development-environment-with-rooter-11in

    home.packages = with pkgs; [
      unstable.cachix
      unstable.devenv
      inputs.rooter.packages.${pkgs.system}.rooter
    ];

    programs = {
      direnv = {
        enable = true;
        nix-direnv.enable = true;
      };
    };
  };
}
