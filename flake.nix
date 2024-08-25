{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
    # nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-23.11";
    # nixpkgs-old.url = "github:nixos/nixpkgs/nixos-22.05";
    nixpkgs-master.url = "github:nixos/nixpkgs/master";
    # nur.url = "github:nix-community/NUR";
    ags.url = "github:Aylur/ags";

    rooter = {
      url = "github:run-as-root/rooter";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };

    # nixos-cosmic = {
    #   url = "github:lilyinstarlight/nixos-cosmic";
    #   inputs.nixpkgs.follows = "nixpkgs-unstable";
    # };

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland-plugins.url = "github:hyprwm/hyprland-plugins";

    home-manager = {
      url = github:nix-community/home-manager/release-24.05;
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, nixpkgs-stable, nixpkgs-unstable, nixpkgs-master, home-manager, ... }@inputs:
  let
    system = "x86_64-linux";

    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };

    desktop = import ./nixos/hosts/desktop/desktop.nix { inherit pkgs; };
    vm = import ./nixos/hosts/vm/vm.nix { inherit desktop; };
  in
  {
    nixosConfigurations = {
      ${desktop.user} = nixpkgs.lib.nixosSystem {
        inherit system;
        specialArgs = let vars = desktop; in { inherit inputs vars; };
        modules = [
          ./nixos/hosts/desktop/hardware-configuration.nix      # Include the results of the hardware scan.
          ./nixos/nixosModules.nix

          home-manager.nixosModules.home-manager {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = let vars = desktop; in { inherit inputs vars; };
            home-manager.users.${desktop.user} = {
              imports = [ ./home-manager/home.nix ];
            };
          }
        ];
      };

      ${vm.user} = nixpkgs.lib.nixosSystem {
        inherit system;
        specialArgs = let vars = vm; in { inherit inputs vars; };
        modules = [
          ./nixos/nixosModules.nix
          /etc/nixos/hardware-configuration.nix                 # Impure, run: sudo nixos-rebuild switch --flake .#vm --impure
          # /etc/nixos/configuration.nix

          home-manager.nixosModules.home-manager {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs =
            let
              vars = vm;
            in
            { inherit inputs vars; };
            home-manager.users.${vm.user} = {
              imports = [ ./home-manager/home.nix ];
            };
          }
        ];
      };
    };
  };
}
