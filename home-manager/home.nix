{ config, pkgs, vars, ... }:

{
  # Home Manager needs a bit of information about you and the
  # paths it should manage.
  home.username = "${vars.user}";
  home.homeDirectory = "/home/${vars.user}";

  imports = [
    ./hosts/desktop/mime-defaultapps.nix  # xdg default apps (mime) - for user PC
    ./hosts/desktop/extensions.nix        # gnome extensions
    ./shell/aliases.nix
    ./shell/fish/fish.nix
    ./shell/fish/plugins/autopair.nix
    ./shell/fish/plugins/done.nix
    ./shell/fish/plugins/sponge.nix
    ./shell/fish/plugins/tide.nix
    ./shell/fish/omf/commands.nix
    ./shell/bashrc.nix
    ./xdg/xdg.nix                         # xdg
    ./hypr/hyprland.nix
    ./ags.nix                             # top bar + shell https://github.com/Aylur/ags
    ./waybar.nix                          # top bar - wayland
    ./gtklock.nix                         # GTK lock screen
    ./swaylock.nix                        # Sway lock screen
    ./hypr/hyprlock.nix                   # Hypr lock screen
    ./hypr/hypridle.nix                   # idle inhibitor
    ./hypr/commands.nix                   # dekstop entries / commands
    ./hypr/hyprpaper.nix                  # wallpaper
    ./hypr/hyprcursor-mcmojave.nix        # cursors
    ./gnome/gtk.nix                       # extra packages, gtk configs, session variables, pointer
    ./gnome/dconf-settings.nix            # gtk dconf settings
    ./gnome/keyboard-shortcuts.nix
    ./gnome/autostart/albert.nix
    ./gnome/autostart/copyq.nix
    ./gnome/autostart/xpad.nix
    ./gnome/packages.nix
    ./gnome/extensions  # enables/disables extensions
    ./gnome/extensions/blur-my-shell.nix
    ./gnome/extensions/caffeine.nix
    ./gnome/extensions/dash-to-panel.nix
    ./gnome/extensions/executor.nix
    ./gnome/extensions/gtile.nix
    ./gnome/extensions/media-controls.nix
    ./gnome/extensions/pop-shell.nix
    ./gnome/extensions/super-key.nix
    ./gnome/extensions/tiling-assistant.nix
    ./gnome/extensions/useless-gaps.nix
    ./gnome/extensions/user-themes.nix
    ./gnome/extensions/no-overview.nix
    ./gnome/extensions/gsconnect.nix
    ./gnome/extensions/fuzzy-app-search.nix
    ./gnome/extensions/appindicator.nix
    ./gnome/extensions/workspace-indicator.nix
    ./gnome/extensions/openweather.nix
    ./gnome/extensions/rounded-window-corners.nix
    ./gnome/extensions/tray-icons-reloaded.nix
    ./gnome/extensions/bluetooth-battery-meter.nix
    ./gnome/extensions/weatherornot.nix
    ./gnome/extensions/astra-monitor.nix
    ./gnome/extensions/sound-percentage.nix
    ./packages.nix                          # shared packages
    ./fonts/ubuntu-font-family.nix
    ./fonts/font-awesome.nix
    ./fonts/font-awesome5.nix
    ./fonts/material-symbols.nix
    ./fonts/noto-fonts-emoji.nix
    ./fonts/nerdfonts.nix
    ./fonts/jetbrains-mono.nix
    ./fonts/roboto.nix
    ./fonts/montserrat.nix
    ./fonts/cantarell-fonts.nix
    ./chrome.nix
    ./terminator.nix                        # terminal config
    ./xterm.nix
    ./mpv.nix                               # mpv video player and its config
    ./fastfetch.nix                         # neofetch replacement
    ./vscode.nix
    ./brave.nix                             # browser
    ./zoxide.nix                            # z - smarter cd
    ./phpstorm.nix                          # PHP IDE
    ./distrobox.nix
    ./rooter.nix                            # magento https://github.com/run-as-root/rooter
    ./kdeconnect.nix
    ./eza.nix                               # ls replacement
    ./bat.nix                               # cat replacement
    ./fd.nix                                # find replacement
    ./ripgrep.nix                           # grep replacement
    ./git.nix
    ./kitty.nix                             # terminal
    ./yazi.nix                              # file explorer in terminal
    ./micro.nix                             # terminal text editor
    ./copyq.nix                             # config for copyq
    ./peco.nix                              # better reverse search
    ./albert.nix                            # linux launcher
    ./shell/docker.nix                      # docker aliases for fish/bash
    ./shell/warden.nix                      # warden aliases for fish/bash
    ./scripts/yeelight.nix                  # smart lights
    ./scripts/startup.nix
    ./scripts/bluetoothbatterypercentage.nix
    ./scripts/btupowerbatterypercentage.nix
    ./scripts/yrweather.nix
    ./scripts/openweathermap.nix
    ./scripts/toggleidle.nix
    ./scripts/nightlight.nix
    ./scripts/note.nix
    ./scripts/screenshot.nix
    ./scripts/openstartupapps.nix
    ./scripts/idle.nix
    ./scripts/powermenu.nix
    ./scripts/wakefromsleep.nix
    ./scripts/ngrokwarden.nix
    ./scripts/headset.nix
    ./scripts/monitor.nix
    ./scripts/resetbluetoothags.nix
    ./scripts/sys.nix
    ./scripts/clipboardtoggle.nix
    ./scripts/sync.nix
    ./scripts/exportbluetoothinfo.nix
    ./localsend.nix                         # used for file sharing with other PC/mobile devices
    ./teamviewer.nix
    ./rofi.nix                              # app launcher
    ./swaync.nix                            # sway notification center
    ./ghostty.nix                           # ghostty terminal
  ];

  module = {
    packages = {
      enable = (vars.modules.home-manager.packages.enable or true);
      terminator.enable = (vars.modules.home-manager.packages.terminator.enable or false);
      git.enable = (vars.modules.home-manager.packages.git.enable or false);
      chrome.enable = (vars.modules.home-manager.packages.chrome.enable or false);
      xterm.enable = (vars.modules.home-manager.packages.xterm.enable or false);
      mpv.enable = (vars.modules.home-manager.packages.mpv.enable or false);
      fastfetch.enable = (vars.modules.home-manager.packages.fastfetch.enable or false);
      brave.enable = (vars.modules.home-manager.packages.brave.enable or false);
      vscode.enable = (vars.modules.home-manager.packages.vscode.enable or false);
      zoxide.enable = (vars.modules.home-manager.packages.zoxide.enable or false);
      phpstorm.enable = (vars.modules.home-manager.packages.phpstorm.enable or false);
      distrobox.enable = (vars.modules.home-manager.packages.distrobox.enable or false);
      rooter.enable = (vars.modules.home-manager.packages.rooter.enable or false);
      kdeconnect.enable = (vars.modules.home-manager.packages.kdeconnect.enable or false);
      eza.enable = (vars.modules.home-manager.packages.eza.enable or false);
      bat.enable = (vars.modules.home-manager.packages.bat.enable or false);
      fd.enable = (vars.modules.home-manager.packages.fd.enable or false);
      ripgrep.enable = (vars.modules.home-manager.packages.ripgrep.enable or false);
      kitty.enable = (vars.modules.home-manager.packages.kitty.enable or false);
      ghostty.enable = (vars.modules.home-manager.packages.ghostty.enable or false);
      yazi.enable = (vars.modules.home-manager.packages.yazi.enable or false);
      micro.enable = (vars.modules.home-manager.packages.micro.enable or false);
      copyq.enable = (vars.modules.home-manager.packages.copyq.enable or false);
      localsend.enable = (vars.modules.home-manager.packages.localsend.enable or false);
      teamviewer.enable = (vars.modules.home-manager.packages.teamviewer.enable or false);
      peco.enable = (vars.modules.home-manager.packages.peco.enable or false);
      albert.enable = (vars.modules.home-manager.packages.albert.enable or false);
      rofi.enable = (vars.modules.home-manager.packages.rofi.enable or false);
      swaync.enable = (vars.modules.home-manager.packages.swaync.enable or false);
    };
    shell = {
      aliases.enable = (vars.modules.home-manager.shell.aliases.enable or false);
      fish = {
        enable = (vars.modules.home-manager.shell.fish.enable or false);
        plugins = {
          autopair.enable = (vars.modules.home-manager.shell.fish.plugins.autopair.enable or false);
          done.enable = (vars.modules.home-manager.shell.fish.plugins.done.enable or false);
          sponge.enable = (vars.modules.home-manager.shell.fish.plugins.sponge.enable or false);
          tide.enable = (vars.modules.home-manager.shell.fish.plugins.tide.enable or false);
        };
        omf-commands.enable = (vars.modules.home-manager.shell.fish.omf-commands.enable or false);
      };
      bash = {
        enable = (vars.modules.home-manager.shell.bash.enable or false);
        bashrc.enable = (vars.modules.home-manager.shell.bash.bashrc.enable or false);
      };
      docker.enable = (vars.modules.home-manager.shell.docker.enable or false);
      warden = {
        enable = (vars.modules.home-manager.shell.warden.enable or false);
        aliases.enable = (vars.modules.home-manager.shell.warden.aliases.enable or false);
      };
    };
    xdg = {
      enable = (vars.modules.home-manager.xdg.enable or false);
      defaultapps = {
        hosts.desktop.enable = (vars.modules.home-manager.xdg.defaultapps.hosts.desktop.enable or false);
      };
    };
    hypr = {
      hyprland = {
        enable = (vars.modules.home-manager.hypr.hyprland.enable or false);
        packages.enable = (vars.modules.home-manager.hypr.hyprland.packages.enable or false);
        gnome-packages.enable = (vars.modules.home-manager.hypr.hyprland.gnome-packages.enable or false);
      };
      commands.enable = (vars.modules.home-manager.hypr.commands.enable or false);
      hyprpaper = {
        enable = (vars.modules.home-manager.hypr.hyprpaper.enable or false);
        backgroundImagePath = (vars.modules.home-manager.hypr.hyprpaper.backgroundImagePath or "");
      };
      hyprcursors.enable = (vars.modules.home-manager.hypr.hyprcursors.enable or false);
    };
    bar = {
      ags.enable = (vars.modules.home-manager.bar.ags.enable or false);
      waybar.enable = (vars.modules.home-manager.bar.waybar.enable or false);
    };
    screen-locker = {
      swaylock.enable = (vars.modules.home-manager.screen-locker.swaylock.enable or false);
      gtklock.enable = (vars.modules.home-manager.screen-locker.gtklock.enable or false);
      hyprlock.enable = (vars.modules.home-manager.screen-locker.hyprlock.enable or false);
      hyprlock.backgroundImagePath = (vars.modules.home-manager.screen-locker.hyprlock.backgroundImagePath or "");
    };
    idle-inhibitor = {
      hypridle.enable = (vars.modules.home-manager.idle-inhibitor.hypridle.enable or false);
    };
    gnome = {
      gtk-config.enable = (vars.modules.home-manager.gnome.gtk-config.enable or false);
      gtkThemePackage = (vars.gtk.gtkThemePackage or (pkgs.orchis-theme.override { border-radius = 3; tweaks = [ "compact" "macos" "submenu" ];}));
      preferDarkTheme = (vars.gtk.preferDarkTheme or 1);
      favoriteApps = (vars.gtk.favoriteApps or [ "org.gnome.Nautilus.desktop" "org.gnome.TextEditor.desktop" ]);
      cursorPackage = (vars.gtk.cursorPackage or pkgs.apple-cursor);
      dconf-settings.enable = (vars.modules.home-manager.gnome.dconf-settings.enable or false);
      keyboard-shortcuts.enable = (vars.modules.home-manager.gnome.keyboard-shortcuts.enable or false);
      packages.enable = (vars.modules.home-manager.gnome.packages.enable or false);
      autostart = {
        copyq.enable = (vars.modules.home-manager.gnome.autostart.copyq.enable or false);
        albert.enable = (vars.modules.home-manager.gnome.autostart.albert.enable or false);
        xpad.enable = (vars.modules.home-manager.gnome.autostart.xpad.enable or false);
      };
      extension = {
        enable = (vars.modules.home-manager.gnome.extension.enable or false);
        hosts.desktop.enable = (vars.modules.home-manager.gnome.extension.hosts.desktop.enable or false);
        blur-my-shell.enable = (vars.modules.home-manager.gnome.extension.blur-my-shell.enable or false);
        caffeine.enable = (vars.modules.home-manager.gnome.extension.caffeine.enable or false);
        dash-to-panel.enable = (vars.modules.home-manager.gnome.extension.dash-to-panel.enable or false);
        executor.enable = (vars.modules.home-manager.gnome.extension.executor.enable or false);
        gtile.enable = (vars.modules.home-manager.gnome.extension.gtile.enable or false);
        super-key.enable = (vars.modules.home-manager.gnome.extension.super-key.enable or false);
        useless-gaps.enable = (vars.modules.home-manager.gnome.extension.useless-gaps.enable or false);
        media-controls.enable = (vars.modules.home-manager.gnome.extension.media-controls.enable or false);
        tiling-assistant.enable = (vars.modules.home-manager.gnome.extension.tiling-assistant.enable or false);
        pop-shell.enable = (vars.modules.home-manager.gnome.extension.pop-shell.enable or false);
        user-themes.enable = (vars.modules.home-manager.gnome.extension.user-themes.enable or false);
        no-overview.enable = (vars.modules.home-manager.gnome.extension.no-overview.enable or false);
        gsconnect.enable = (vars.modules.home-manager.gnome.extension.gsconnect.enable or false);
        fuzzy-app-search.enable = (vars.modules.home-manager.gnome.extension.fuzzy-app-search.enable or false);
        appindicator.enable = (vars.modules.home-manager.gnome.extension.appindicator.enable or false);
        workspace-indicator.enable = (vars.modules.home-manager.gnome.extension.workspace-indicator.enable or false);
        openweather.enable = (vars.modules.home-manager.gnome.extension.openweather.enable or false);
        rounded-window-corners.enable = (vars.modules.home-manager.gnome.extension.rounded-window-corners.enable or false);
        tray-icons-reloaded.enable = (vars.modules.home-manager.gnome.extension.tray-icons-reloaded.enable or false);
        bluetooth-battery-meter.enable = (vars.modules.home-manager.gnome.extension.bluetooth-battery-meter.enable or false);
        weatherornot.enable = (vars.modules.home-manager.gnome.extension.weatherornot.enable or false);
        astra-monitor.enable = (vars.modules.home-manager.gnome.extension.astra-monitor.enable or false);
        sound-percentage.enable = (vars.modules.home-manager.gnome.extension.sound-percentage.enable or false);
      };
    };
    fonts = {
      ubuntu-font-family.enable = (vars.modules.home-manager.fonts.ubuntu-font-family.enable or false);
      font-awesome.enable = (vars.modules.home-manager.fonts.font-awesome.enable or false);
      font-awesome5.enable = (vars.modules.home-manager.fonts.font-awesome5.enable or false);
      material-symbols.enable = (vars.modules.home-manager.fonts.material-symbols.enable or false);
      noto-fonts-emoji.enable = (vars.modules.home-manager.fonts.noto-fonts-emoji.enable or false);
      nerdfonts.enable = (vars.modules.home-manager.fonts.nerdfonts.enable or false);
      jetbrains-mono.enable = (vars.modules.home-manager.fonts.jetbrains-mono.enable or false);
      roboto.enable = (vars.modules.home-manager.fonts.roboto.enable or false);
      montserrat.enable = (vars.modules.home-manager.fonts.montserrat.enable or false);
      cantarell-fonts.enable = (vars.modules.home-manager.fonts.cantarell-fonts.enable or false);
    };
    scripts = {
      yeelight.enable = (vars.modules.home-manager.scripts.yeelight.enable or false);
      startup.enable = (vars.modules.home-manager.scripts.startup.enable or false);
      bluetoothbatterypercentage.enable = (vars.modules.home-manager.scripts.bluetoothbatterypercentage.enable or false);
      btupowerbatterypercentage.enable = (vars.modules.home-manager.scripts.btupowerbatterypercentage.enable or false);
      yrweather.enable = (vars.modules.home-manager.scripts.yrweather.enable or false);
      openweathermap.enable = (vars.modules.home-manager.scripts.openweathermap.enable or false);
      toggleidle.enable = (vars.modules.home-manager.scripts.toggleidle.enable or false);
      nightlight.enable = (vars.modules.home-manager.scripts.nightlight.enable or false);
      note.enable = (vars.modules.home-manager.scripts.note.enable or false);
      screenshot.enable = (vars.modules.home-manager.scripts.screenshot.enable or false);
      openstartupapps.enable = (vars.modules.home-manager.scripts.openstartupapps.enable or false);
      idle.enable = (vars.modules.home-manager.scripts.idle.enable or false);
      powermenu.enable = (vars.modules.home-manager.scripts.powermenu.enable or false);
      wakefromsleep.enable = (vars.modules.home-manager.scripts.wakefromsleep.enable or false);
      ngrokwarden.enable = (vars.modules.home-manager.scripts.ngrokwarden.enable or false);
      headset.enable = (vars.modules.home-manager.scripts.headset.enable or false);
      monitor.enable = (vars.modules.home-manager.scripts.monitor.enable or false);
      resetbluetoothags.enable = (vars.modules.home-manager.scripts.resetbluetoothags.enable or false);
      sys.enable = (vars.modules.home-manager.scripts.sys.enable or false);
      clipboardtoggle.enable = (vars.modules.home-manager.scripts.clipboardtoggle.enable or false);
      sync.enable = (vars.modules.home-manager.scripts.sync.enable or false);
      exportbluetoothinfo.enable = (vars.modules.home-manager.scripts.exportbluetoothinfo.enable or false);
    };
  };

  # This value determines the Home Manager release that your
  # configuration is compatible with. This helps avoid breakage
  # when a new Home Manager release introduces backwards
  # incompatible changes.
  #
  # You can update Home Manager without changing this value. See
  # the Home Manager release notes for a list of state version
  # changes in each release.
  home.stateVersion = "22.11";

  # Let Home Manager install and manage itself.
  programs.home-manager.enable = true;
}
