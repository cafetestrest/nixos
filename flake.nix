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
      url = "github:lilyinstarlight/nixos-cosmic";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
      # inputs.nixpkgs.follows = "nixpkgs-unstable";
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
    pc = {
      user = "bajic";
      networkingHostName = "nixos";
      timezone = "Europe/Belgrade";
      defaultLocale = "en_GB.UTF-8";
      consoleFont = "Lat2-Terminus16";
      initialPassword = "$y$j9T$8zHiYDS6ygvXsdcgXn2pg1$6BkJP/RL33k.q5vUPfXyT0DelCZEt8RbUAcDysQ22A3";
      nixExtraOptions = "experimental-features = nix-command flakes";
      efiSysMountPoint = "/boot/efi";
      grubDevice = "/dev/vda";  # vm device location
      configurationLimit = 20;
      gtk = {
        cursorSize = 24;
        cursorTheme = "macOS-Monterey";
        gtkTheme = "Orchis-Dark";
        gtkIconTheme = "Adwaita";
        gtkFontName = "Cantarell 11";
      };
      sha = {
        wardenSha256Hash = "sha256-XX/GJEhCiOUkuZ0Wetcrqc9BTJE7UUKetNiW+t4g+Y4="; #nix-shell -p nix-prefetch-git jq --run "nix hash to-sri sha256:\$(nix-prefetch-git --url https://github.com/wardenenv/warden --quiet --rev refs/heads/main | jq -r '.sha256')"
        fishOmfPecoPluginSha256Hash = "sha256-EUoicPd+aUMlfCeo9BOuIiBlQSpPtMtMn5AUkZU3uQA=";
        fishOmfVcsPluginSha256Hash = "sha256-BVQgQOnPcqIf4eqLrmuUCvZahyEDKzBgJUeppLQWjQY=";
        fishOmfThemeDefaultSha256Hash = "sha256-FVZhJo6BTz5Gt7RSOnXXU0Btxejg/p89AhZOvB9Xk1k=";
      };
      commit = {
        yeelightShellScriptsGitRev = "d8b463dea258b4f1fdf4277dd5b37ca8bebad3ee";
      };
      modules = {
        configuration.enable = true;  # use default configuration.nix file
        bootloader = {
          grub.enable = false;
          systemd-boot.enable = true;
        };
        virtualisation = {
          virt-manager.enable = false;
          spice-virt-manager.enable = false;
          docker = {
            enable = true;
            warden = true;
          };
        };
        shell = {
          default-fish.enable = true;
        };
        desktop-environment = {
          hyprland.enable = true;
          plasma6.enable = false;
          gnome.enable = false;
          cosmic.enable = false;
        };
        display-manager = {
          gdm = {
            enable = true;
            custom-background.enable = true;
          };
          sddm.enable = false;
        };
        screen-locker = {
          hyprlock.enable = true;
          swaylock.enable = false;
          gtklock.enable = false;
        };
        bar = {
          ags.enable = true;
          waybar.enable = false;
        };
        services = {
          udev = {
            rangoli.enable = false;
          };
          i2c.enable = true;
        };
        programs = {
          headsetcontrol.enable = true;
          devenv.enable = false;
          localsend.enable = true;
          chrome.settings.enable = true;
          teamviewer.enable = false;
          copyq.enable = true;
          doas.enable = false;
        };
        home-manager = {
          git.enable = true;
          terminator.enable = true;
        };
      };
    };

    vm = {
      user = "test";
      networkingHostName = "nixos";
      timezone = "America/New_York";
      defaultLocale = "en_GB.UTF-8";
      consoleFont = "Lat2-Terminus16";
      initialPassword = "$y$j9T$8zHiYDS6ygvXsdcgXn2pg1$6BkJP/RL33k.q5vUPfXyT0DelCZEt8RbUAcDysQ22A3";
      nixExtraOptions = "experimental-features = nix-command flakes";
      efiSysMountPoint = "/boot/efi";
      grubDevice = "/dev/vda";
      configurationLimit = 20;
      gtk = pc.gtk;
      sha = pc.sha;
      commit = pc.commit;
      modules = {
        configuration.enable = true;  # use default configuration.nix file (if you want to use /etc/nixos/configuration.nix disable this)
        bootloader = {
          grub.enable = true;
          systemd-boot.enable = false;
        };
        drive = {
          ssd.enable = true;
          ntfs.enable = true;
        };
        hardware = {
          bluetooth.enable = true;
          wireless.enable = false;
          amd-gpu.enable = false;
        };
        virtualisation = {
          virt-manager.enable = false;
          spice-virt-manager.enable = true;
        };
        desktop-environment = {
          gnome.enable = true;
        };
        home-manager = {
          git.enable = true;
          terminator.enable = false;
        };
      };
    };

    #TODO all all systems, choose which one is proper one
    system = "x86_64-linux";

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
        #   test = test-nur.packages.${prev.system};  #TODO move overlays
        # };
      };
    };
  in
  {
    nixosConfigurations = {
      ${pc.user} = lib.nixosSystem {
        inherit system;
        specialArgs =
        let
          vars = pc;
        in
        { inherit inputs vars; };
        modules = [
          ({ config, pkgs, ... }: {
            nixpkgs.overlays = [ overlay-old overlay-stable overlay-unstable overlay-nur ]; #TODO move overlays
          }) # https://nixos.wiki/wiki/Flakes#Importing_packages_from_multiple_channels
          # TODO move to module file (all should be enabled when they all have their own config)
          ./nixos/bootloader/systemd-boot.nix                   # Boot and Bootloader config
          ./nixos/bootloader/grub.nix
          ./nixos/hosts/desktop/hardware-configuration.nix      # Include the results of the hardware scan.
          ./nixos/ssd.nix                                       # fstrim
          ./nixos/ntfs.nix                                      # windows ntfs file partition support
          ./nixos/bluetooth.nix                                 # bluetooth support and blueman
          ./nixos/wireless.nix
          ./nixos/hosts/desktop/amd-gpu.nix                     # configuration for AMD GPU
          ./nixos/hosts/configuration.nix                       # shared configuration
          ./nixos/hosts/packages.nix                            # shared packages # TODO separate and add config here too, this one should be sharedPackages 
          ./nixos/fishdefaultshell.nix                          # sets default shell (fish)
          ./nixos/hyprland.nix                                  # hyprland packages
          ./nixos/kde/plasma.nix                                # KDE plasma DE
          ./nixos/gnome/gnome.nix
          # ./nixos/cosmic/cosmic.nix
          ./nixos/gdm/gdm.nix
          ./nixos/gdm/background.nix                            # background for gdm
          # ./nixos/swaylock.nix                                  # lockscreen packages
          # ./nixos/gtklock.nix                                   # lockscreen packages
          ./nixos/docker/docker.nix                             # docker, docker-compose and /etc/hosts
          ./nixos/docker/warden.nix
          ./nixos/headsetcontrol.nix                            # used to retrieve battery percentage from headset - udev rules
          # ./nixos/waybar.nix
          # ./nixos/devenv.nix                                    # required for https://github.com/run-as-root/rooter
          ./nixos/hosts/vm/packages.nix                         # virt-manager packages and libvirtd
          ./nixos/hosts/vm/spice-virt-manager.nix               # tools for VM copy/paste clipboard
          ./nixos/localsend.nix                                 # used for file sharing with other PC/mobile devices
          # ./nixos/chromesettings.nix                            # chrome settings -> enables WideVine
          # ./nixos/teamviewer.nix
          ./nixos/copyq.nix
          # ./nixos/udev/rangoli-udev.nix                         # needs distrobox from home-manager
          ./nixos/i2c.nix                                       # for ddcutil (monitor control)
          # ./nixos/doas.nix                                      # replace sudo with doas

          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs =
            let
              vars = pc;
            in
            { inherit inputs vars; };
            home-manager.users.${pc.user} = {
              imports = [
                # TODO move to module file (all should be enabled when they all have their own config)
                #each has more inputs on their own, go into one by one and configure as needed
                ./home-manager/home.nix
                ./home-manager/shell/shells.nix                 # fish (default) + bash
                ./home-manager/mime-defaultapps.nix             # xdg + default apps (mime)
                ./home-manager/hypr/hyprland.nix
                ./home-manager/ags.nix                          # top bar + shell https://github.com/Aylur/ags
                # ./home-manager/swaylock.nix                   # lock screen
                ./home-manager/hypr/hyprlock.nix                # lock screen
                ./home-manager/hypr/hypridle.nix                # idle inhibitor
                ./home-manager/hypr/commands.nix                # dekstop entries / commands
                # ./home-manager/hypr/hyprpaper.nix             # wallpaper
                # ./home-manager/hypr/hyprcursors.nix           # cursors
                ./home-manager/gnome/gtk.nix                    # extra packages, gtk configs, session variables, pointer
                ./home-manager/gnome/dconf-settings.nix         # gtk dconf settings
                # ./home-manager/gnome/home.nix
                # ./home-manager/gnome/extensions.nix           # gnome extensions
                ./home-manager/packages.nix                     # shared packages
                ./home-manager/fonts.nix
                # ./home-manager/chrome.nix
                ./home-manager/terminator.nix                   # terminal config
                # ./home-manager/xterm.nix
                ./home-manager/scripts/scripts.nix              # scripts, place to store all common scripts
                ./home-manager/mpv.nix                          # mpv video player and its config
                ./home-manager/fastfetch.nix                    # neofetch replacement
                ./home-manager/vscode.nix
                ./home-manager/brave.nix                        # browser
                ./home-manager/zoxide.nix                       # z - smarter cd
                ./home-manager/yeelight.nix                     # smart lights
                ./home-manager/phpstorm.nix                     # PHP IDE
                # ./home-manager/distrobox.nix
                # ./home-manager/rooter.nix                       # magento https://github.com/run-as-root/rooter
                # ./home-manager/kdeconnect.nix
                ./home-manager/eza.nix                          # ls replacement
                ./home-manager/bat.nix                          # cat replacement
                ./home-manager/fd.nix                           # find replacement
                # ./home-manager/ripgrep.nix                      # grep replacement
                ./home-manager/git.nix
                ./home-manager/kitty.nix                        # terminal
                ./home-manager/yazi.nix                         # file explorer in terminal
                ./home-manager/micro.nix                        # terminal text editor
                ./home-manager/copyq.nix                        # config for copyq
                ./home-manager/shell/docker/shells.nix          # docker aliases for fish/bash
                ./home-manager/shell/warden/shells.nix          # warden aliases for fish/bash
              ];
            };
          }
        ];
      };

      ${vm.user} = lib.nixosSystem {
        inherit system;
        specialArgs =
        let
          vars = vm;
        in
        { inherit inputs vars; };
        modules = [
          ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-old overlay-stable overlay-unstable nur.overlay ]; }) # TODO move to overlay file 
          # TODO all should be here as well as for PC
          ./nixos/bootloader/grub.nix                           # VM Boot and Bootloader config
          ./nixos/bootloader/systemd-boot.nix
          ./nixos/hosts/configuration.nix                       # shared configuration
          ./nixos/hosts/packages.nix                            # shared packages
          ./nixos/hosts/vm/spice-virt-manager.nix               # tools for VM copy/paste clipboard
          /etc/nixos/hardware-configuration.nix                 # Impure, run: sudo nixos-rebuild switch --flake .#vm --impure
          # /etc/nixos/configuration.nix
          # ./nixos/kde/plasma.nix                                # KDE plasma DE
          # ./nixos/gnome/gnome.nix
          # ./nixos/cosmic/cosmic.nix
          # ./nixos/gdm/gdm.nix

          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs =
            let
              vars = vm;
            in
            { inherit inputs vars; };
            home-manager.users.${vm.user} = {
              imports = [
                # TODO all should be here as well as for PC
                ./home-manager/home.nix
                ./home-manager/gnome/home.nix
                ./home-manager/gnome/extensions.nix
                ./home-manager/terminator.nix                   # terminal config
                ./home-manager/git.nix
              ];
            };
          }
        ];
      };
    };
  };
}
