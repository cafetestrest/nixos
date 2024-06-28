{ config, pkgs, ... }:

{
  users.defaultUserShell = pkgs.fish;

  programs.fish = {
    enable = true;
  };
}

# # Installed omf like so:
# sudo chmod +w -R ~/.local/share/omf
# omf-install
# omf theme default
# omf install peco
# omf install z
# omf install vcs
