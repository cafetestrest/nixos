{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
    # nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-24.11";
    nixpkgs-master.url = "github:nixos/nixpkgs/master";
    ghostty.url = "github:ghostty-org/ghostty";

    astal = {
      url = "github:Aylur/astal";
    };

    ags = {
      url = "github:Aylur/ags";
      inputs.astal.follows = "astal";
    };

    kompass = {
      url = "github:kotontrion/kompass";
      inputs.astal.follows = "astal";
    };

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
      ref = "refs/tags/v0.49.0";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland-plugins.url = "github:hyprwm/hyprland-plugins";

    home-manager = {
      url = github:nix-community/home-manager/release-25.05;
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

    desktop = import ./nixos/hosts/desktop/desktop-modules.nix { inherit pkgs; };
    vm = import ./nixos/hosts/vm/vm-modules.nix { inherit desktop; };
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
          /etc/nixos/hardware-configuration.nix                 # Impure, run: sudo nixos-rebuild switch --flake .#$USER --impure
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
