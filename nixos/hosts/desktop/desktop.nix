{ pkgs }:

rec {
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
    cursorPackage = pkgs.apple-cursor;
    gtkThemePackage = (pkgs.orchis-theme.override { border-radius = 3; tweaks = [ "compact" "macos" "submenu" ];});
    gtkTheme = "Orchis-Dark";
    gtkIconTheme = "Adwaita";
    gtkFontName = "Cantarell 11";
    preferDarkTheme = 1;
    favoriteApps = [ "kitty.desktop" "brave-browser.desktop" "org.gnome.Nautilus.desktop" "org.gnome.TextEditor.desktop" ];
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
    overlay = {
      pkgs.enable = true; # nix pkgs overlays
      waybar.enable = false;
    };
    bootloader = {
      grub.enable = false;
      systemd-boot.enable = true;
    };
    drive = {
      ssd.enable = true;
      ntfs.enable = true;
    };
    hardware = {
      bluetooth = {
        enable = true;
        blueman.enable = modules.hardware.bluetooth.enable;
      };
      wireless.enable = false;
      amd-gpu.enable = false;
      opengl.enable = modules.hardware.amd-gpu.enable;
    };
    virtualisation = {
      enable = true;
      virt-manager.enable = false;
      spice-virt-manager.enable = false;
      docker = {
        enable = true;
        warden.enable = true;
        xdebug-ports.enable = true;
      };
    };
    shell = {
      fish.enable = true;
      default-fish.enable = true;
    };
    xdg.enable = true;
    desktop-environment = {
      hyprland = {
        enable = true;
        services.enable = modules.desktop-environment.hyprland.enable;
      };
      plasma6.enable = false;
      gnome = {
        enable = false;
        auto-login.enable = false;
      };
      cosmic.enable = false;
    };
    display-manager = {
      gdm = {
        enable = true;
        custom-background.enable = true;
        backgroundImagePath = "file:///etc/nixos/lockscreen.jpg";
      };
    };
    screen-locker = {
      hyprlock = {
        enable = true;
        service = modules.screen-locker.hyprlock.enable;
      };
      swaylock.enable = false;
      gtklock.enable = false;
    };
    security = {
      polkit.enable = true;
    };
    bar = {
      ags.enable = true;
      waybar.enable = false;
    };
    services = {
      udev = {
        rangoli.enable = false;
        headsetcontrol.enable = true;
      };
      i2c.enable = true;
    };
    security = {
      doas.enable = false;
    };
    programs = {
      devenv.enable = false;
      localsend.enable = true;
      chrome = {
        widevine.enable = true;
      };
      teamviewer.enable = false;
      copyq.enable = true;
      ydotool.enable = true;
      extraHosts = ''
        127.0.0.1 ::1 magento2.rooter.test
        127.0.0.1 ::1 test.rooter.test
        127.0.0.1 ::1 rooter.rooter.test
        127.0.0.1 ::1 magento2.test
      '';
    };
    home-manager = {
      packages = {
        enable = true;  # shared packages
        git.enable = true;
        terminator.enable = false;
        chrome.enable = false;
        xterm.enable = false;
        mpv.enable = true;
        fastfetch.enable = true;
        brave.enable = true;
        vscode.enable = true;
        zoxide.enable = true;
        phpstorm.enable = true;
        distrobox.enable = false;
        rooter.enable = false;
        kdeconnect.enable = false;
        eza.enable = true;
        bat.enable = true;
        fd.enable = true;
        ripgrep.enable = false;
        kitty.enable = true;
        yazi.enable = true;
        micro.enable = true;
        peco.enable = true;
        copyq.enable = modules.programs.copyq.enable;
        localsend.enable = modules.programs.localsend.enable;
        teamviewer.enable = modules.programs.teamviewer.enable;
        albert.enable = false;
      };
      scripts = {
        yeelight.enable = true;
        startup.enable = true;
        bluetoothbatterypercentage.enable = false;
        btupowerbatterypercentage.enable = false;
        yrweather.enable = true;
        openweathermap.enable = true;
        toggleidle.enable = true;
        nightlight.enable = true;
        note.enable = true;
        screenshot.enable = true;
        openstartupapps.enable = true;
        idle.enable = true;
        powermenu.enable = true;
        wakefromsleep.enable = true;
        ngrokwarden.enable = true;
        headset.enable = true;
        monitor.enable = true;
        resetbluetoothags.enable = true;
        sys.enable = true;
        clipboardtoggle.enable = false;
        sync.enable = true;
      };
      shell = {
        aliases.enable = true;
        fish = {
          enable = true;
          omf.enable = true;
          omf-plugins.enable = modules.home-manager.shell.fish.omf.enable;
          omf-commands.enable = modules.home-manager.shell.fish.omf.enable;
        };
        bash = {
          enable = true;
          bashrc.enable = true;
        };
        docker.enable = modules.virtualisation.docker.enable;
        warden = {
          enable = modules.virtualisation.docker.warden.enable;
          aliases.enable = false;
        };
      };
      xdg = {
        enable = true;
        defaultapps = {
          hosts.desktop.enable = true; # for user PC
        };
      };
      hypr = {
        hyprland = {
          enable = modules.desktop-environment.hyprland.enable;
          packages.enable = modules.desktop-environment.hyprland.enable;
          gnome-packages.enable = modules.desktop-environment.hyprland.enable;
        };
        commands.enable = modules.bar.ags.enable;
        hyprpaper = {
          enable = false;
          backgroundImagePath = "~/Public/wall/wall.png";
        };
        hyprcursors.enable = false;
      };
      bar = {
        ags.enable = modules.bar.ags.enable;
      };
      screen-locker = {
        swaylock.enable = modules.screen-locker.swaylock.enable;
        gtklock.enable = modules.screen-locker.gtklock.enable;
        hyprlock.enable = modules.screen-locker.hyprlock.enable;
        hyprlock.backgroundImagePath = "/etc/nixos/hyprlock.png";
      };
      idle-inhibitor = {
        hypridle.enable = true;
      };
      gnome = {
        gtk-config.enable = true;
        dconf-settings.enable = true;
        keyboard-shortcuts.enable = modules.desktop-environment.gnome.enable;
        packages.enable = modules.desktop-environment.gnome.enable;
        autostart = {
          copyq.enable = false;
          albert.enable = modules.home-manager.packages.albert.enable;
          xpad.enable = false;
        };
        extension = {
          hosts.desktop.enable = modules.desktop-environment.gnome.enable;
          blur-my-shell.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          caffeine.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          dash-to-panel.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          executor.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          gtile.enable = false;
          super-key.enable = false;
          useless-gaps.enable = false;
          media-controls.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          tiling-assistant.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          pop-shell.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          user-themes.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          no-overview.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          gsconnect.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          fuzzy-app-search.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          appindicator.enable = modules.home-manager.gnome.extension.hosts.desktop.enable;
          workspace-indicator.enable = false;
          openweather.enable = false;
          rounded-window-corners.enable = false;
          tray-icons-reloaded.enable = false;
        };
      };
      fonts = {
        ubuntu-font-family.enable = true;
        font-awesome.enable = true;
        font-awesome5.enable = true;
        material-symbols.enable = true;
        noto-fonts-emoji.enable = true;
        nerdfonts.enable = true;
        jetbrains-mono.enable = true;
        roboto.enable = true;
        montserrat.enable = true;
        cantarell-fonts.enable = true;
      };
    };
  };
}
