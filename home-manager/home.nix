{ config, pkgs, vars, ... }:

{
  # Home Manager needs a bit of information about you and the
  # paths it should manage.
  home.username = "${vars.user}";
  home.homeDirectory = "/home/${vars.user}";

  # TODO move to own config
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
      yeelight.enable = (vars.modules.home-manager.packages.yeelight.enable or false);
      phpstorm.enable = (vars.modules.home-manager.packages.phpstorm.enable or false);
      distrobox.enable = (vars.modules.home-manager.packages.distrobox.enable or false);
      rooter.enable = (vars.modules.home-manager.packages.rooter.enable or false);
      kdeconnect.enable = (vars.modules.home-manager.packages.kdeconnect.enable or false);
      eza.enable = (vars.modules.home-manager.packages.eza.enable or false);
      bat.enable = (vars.modules.home-manager.packages.bat.enable or false);
      fd.enable = (vars.modules.home-manager.packages.fd.enable or false);
      ripgrep.enable = (vars.modules.home-manager.packages.ripgrep.enable or false);
      kitty.enable = (vars.modules.home-manager.packages.kitty.enable or false);
      yazi.enable = (vars.modules.home-manager.packages.yazi.enable or false);
      micro.enable = (vars.modules.home-manager.packages.micro.enable or false);
      copyq.enable = (vars.modules.home-manager.packages.copyq.enable or false);
    };
    shell = {
      aliases.enable = (vars.modules.home-manager.shell.aliases.enable or false);
      fish = {
        enable = (vars.modules.home-manager.shell.fish.enable or false);
        omf-plugins.enable = (vars.modules.home-manager.shell.fish.omf-plugins.enable or false);
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
      defaultapps.enable = (vars.modules.home-manager.xdg.defaultapps.enable or false);
    };
    hypr = {
      hyprland.enable = (vars.modules.home-manager.hypr.hyprland.enable or false);
      commands.enable = (vars.modules.home-manager.hypr.commands.enable or false);
      hyprpaper.enable = (vars.modules.home-manager.hypr.hyprpaper.enable or false);
      hyprcursors.enable = (vars.modules.home-manager.hypr.hyprcursors.enable or false);
    };
    bar = {
      ags.enable = (vars.modules.home-manager.bar.ags.enable or false);
    };
    screen-locker = {
      swaylock.enable = (vars.modules.home-manager.screen-locker.swaylock.enable or false);
      hyprlock.enable = (vars.modules.home-manager.screen-locker.hyprlock.enable or false);
    };
    idle-inhibitor = {
      hypridle.enable = (vars.modules.home-manager.idle-inhibitor.hypridle.enable or false);
    };
    gnome = {
      gtk-config.enable = (vars.modules.home-manager.gnome.gtk-config.enable or false);
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
