{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    nur.url = "github:nix-community/NUR";

    home-manager = {
      url = github:nix-community/home-manager;
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, nur, home-manager }:
    let
      inherit (import ./variables.nix)
        user
        homeDirectory
        systemArchitecture;

      system = "${systemArchitecture}";

      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };

      lib = nixpkgs.lib;

      # https://discourse.nixos.org/t/only-one-nixpkgs-in-a-flake-input-can-allow-unfree/8866
      overlay-unstable = final: prev: {
        unstable = import nixpkgs-unstable {
          system = "${prev.system}";
          config.allowUnfree = true;
        };
      };
    in
    {
      nixosConfigurations = {
        ${user} = lib.nixosSystem {
          inherit system;
          modules = [
            # https://nixos.wiki/wiki/Flakes#Importing_packages_from_multiple_channels
            ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-unstable nur.overlay ]; })
            ./hosts/configuration.nix
            ./modules/gnome/extensions.nix
            home-manager.nixosModules.home-manager
            {
              home-manager.useGlobalPkgs = true;
              home-manager.useUserPackages = true;
              home-manager.users.${user} = {
                imports = [ ./modules/home.nix ];
              };
            }
          ];
        };
      };
    };
}
