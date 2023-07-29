{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-22.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    nur.url = "github:nix-community/NUR";
    # ags.url = "github:Aylur/ags";
    dongsu8142-nur.url = "github:dongsu8142/nur";

    hyprland = {
      url = github:hyprwm/Hyprland;
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };

    home-manager = {
      url = github:nix-community/home-manager/release-23.05;
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, nixpkgs-stable, nur, hyprland, home-manager, dongsu8142-nur }@inputs:
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

    overlay-stable = final: prev: {
      stable = import nixpkgs-stable {
        system = "${prev.system}";
        config.allowUnfree = true;
      };
    };

    overlay-nur = final: prev: {
      nur = import nur {
        nurpkgs = prev;
        pkgs = prev;
        repoOverrides = {
          dongsu8142 = dongsu8142-nur.packages.${prev.system};
        };
      };
    };
  in
  {
    nixosConfigurations = {
      ${user} = lib.nixosSystem {
        inherit system;
        specialArgs = { inherit inputs; };
        modules = [
          ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-unstable overlay-stable overlay-nur ]; }) # https://nixos.wiki/wiki/Flakes#Importing_packages_from_multiple_channels
          ./hosts/desktop
          hyprland.nixosModules.default
          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = { inherit inputs; };
            home-manager.users.${user} = {
              imports = [ ./modules/home.nix ];
            };
            home-manager.users.gdm = { lib, ... }: {
              imports = [ ./modules/gdm/home.nix ];
            };
          }
        ];
      };

      vm = lib.nixosSystem {
        inherit system;
        modules = [
          ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-unstable overlay-stable nur.overlay ]; })
          ./hosts/vm
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
