{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
    home-manager = {
      url = github:nix-community/home-manager;
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, home-manager }:
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
    in {
      nixosConfigurations = {
        ${user} = lib.nixosSystem {
          inherit system;
          modules = [
            ./configuration.nix
            ./gnome/extensions.nix
            home-manager.nixosModules.home-manager {
              home-manager.useGlobalPkgs = true;
              home-manager.useUserPackages = true;
              home-manager.users.${user} = {
                imports = [ ./home.nix ];
              };
            }
          ];
        };
      };
      hmConfig = {
        ${user} = home-manager.lib.homeManagerConfiguration {
          inherit pkgs;
          modules = [
            ./home.nix
            {
              home = {
                username = "${user}";
                homeDirectory = "${homeDirectory}";
              };
            }
          ];
        };
      };
    };
}
