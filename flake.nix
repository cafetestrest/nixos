{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
    # nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-23.11";
    nixpkgs-old.url = "github:nixos/nixpkgs/nixos-22.05";
    nur.url = "github:nix-community/NUR";
    ags.url = "github:Aylur/ags";

    rooter = {
      url = "github:run-as-root/rooter";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };

    nixos-cosmic = {
      url = "github:lxwntr/nixos-cosmic-multiple-de";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };

    hyprland = {
      # url = github:hyprwm/Hyprland;
      url = "git+https://github.com/hyprwm/Hyprland?submodules=1";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };

    hyprland-plugins.url = "github:hyprwm/hyprland-plugins";

    home-manager = {
      url = github:nix-community/home-manager/release-24.05;
      # url = github:nix-community/home-manager/release-23.11;
      # url = github:nix-community/home-manager/master;
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, nixpkgs-old, nixpkgs-stable, nixpkgs-unstable, nur, home-manager, nixos-cosmic, ... }@inputs:
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
    overlay-old = final: prev: {
      old = import nixpkgs-old {
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

    overlay-unstable = final: prev: {
      unstable = import nixpkgs-unstable {
        system = "${prev.system}";
        config.allowUnfree = true;
      };
    };

    overlay-nur = final: prev: {
      nur = import nur {
        nurpkgs = prev;
        pkgs = prev;
        # repoOverrides = {
        #   test = test-nur.packages.${prev.system};
        # };
      };
    };
  in
  {
    nixosConfigurations = {
      ${user} = lib.nixosSystem {
        inherit system;
        specialArgs = { inherit inputs; };
        modules = [
          ({ config, pkgs, ... }: {
            nixpkgs.overlays = [ overlay-old overlay-stable overlay-unstable overlay-nur ];
          }) # https://nixos.wiki/wiki/Flakes#Importing_packages_from_multiple_channels
          ./nixos/hosts/desktop   #Boot and Bootloader config
          ./nixos/hosts/desktop/hardware-configuration.nix      # Include the results of the hardware scan.
          # ./nixos/hosts/desktop/amd-gpu.nix                     # configuration for AMD GPU
          ./nixos/hosts/configuration.nix                       # shared configuration
          ./nixos/hosts/packages.nix                            # shared packages
          ./nixos/fish.nix                                      # fish and its extensions
          ./nixos/bash.nix                                      # bash and shared shell Aliases
          ./nixos/hyprland.nix                                  # hyprland packages
          ./nixos/gnome
          # ./nixos/cosmic
          ./nixos/gdm
          ./nixos/gdm/background.nix                            # background for gdm
          # ./nixos/swaylock.nix                                  # lockscreen packages
          # ./nixos/gtklock.nix                                   # lockscreen packages
          ./nixos/docker                                        # docker, docker-compose and /etc/hosts
          ./nixos/headsetcontrol.nix                            # used to retrieve battery percentage from headset
          # ./nixos/waybar.nix
          # ./nixos/devenv.nix                                    #required for https://github.com/run-as-root/rooter
          #./nixos/hosts/vm/packages.nix                         #virt-manager packages and libvirtd
          #./nixos/hosts/vm/spice-virt-manager.nix               # tools for VM copy/paste clipboard
          ./nixos/localsend.nix                                 #used for file sharing with other PC/mobile devices
          # ./nixos/chromesettings.nix                            #chrome settings -> enables WideVine
          # ./nixos/teamviewer.nix
          ./nixos/copyq.nix

          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = { inherit inputs; };
            home-manager.users.${user} = {
              imports = [
                #each has more inputs on their own, go into one by one and configure as needed
                ./home-manager/home.nix
                ./home-manager/hyprland.nix
                ./home-manager/gnome/home.nix
                ./home-manager/gnome/extensions.nix
              ];
            };
          }
        ];
      };

      vm = lib.nixosSystem {
        inherit system;
        modules = [
          ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-old overlay-stable overlay-unstable nur.overlay ]; })
          ./nixos/hosts/vm
          ./nixos/hosts/configuration.nix                       # shared configuration
          ./nixos/hosts/packages.nix                            # shared packages
          ./nixos/hosts/vm/spice-virt-manager.nix               # tools for VM copy/paste clipboard
          /etc/nixos/hardware-configuration.nix                 # Impure, run: sudo nixos-rebuild switch --flake .#vm --impure 
  
          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.users.${user} = {
              imports = [
                ./home-manager/home.nix
                ./home-manager/gnome/home.nix
                ./home-manager/gnome/extensions.nix
              ];
            };
          }
        ];
      };
    };
  };
}
