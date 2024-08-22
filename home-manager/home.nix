{ config, pkgs, vars, ... }:

{
  # Home Manager needs a bit of information about you and the
  # paths it should manage.
  home.username = "${vars.user}";
  home.homeDirectory = "/home/${vars.user}";

  # TODO move to own config
  module = {
    packages = {
      terminator.enable = (vars.modules.home-manager.packages.terminator.enable or false);
      git.enable = (vars.modules.home-manager.packages.git.enable or false);
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
