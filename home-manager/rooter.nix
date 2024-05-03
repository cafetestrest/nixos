{ inputs, config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user
    username
    ;
in
{
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
}
