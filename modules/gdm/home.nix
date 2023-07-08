{ lib, ... }:

{
  dconf.settings = {
    # "org/gnome/settings-daemon/peripherals/keyboard" = {
    #   numlock-state = "on";
    # };
    "org/gnome/desktop/peripherals/keyboard" = {
      numlock-state = true;
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
  home.stateVersion = "23.05";
}
