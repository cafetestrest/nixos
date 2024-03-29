{ pkgs, ... }:

let
  nerdfonts = (pkgs.nerdfonts.override { fonts = [
    "Ubuntu"
    "UbuntuMono"
    "CascadiaCode"
    "FantasqueSansMono"
    "FiraCode"
    "Mononoki"
  ]; });
in
{
  home.packages = with pkgs; [
    #$pkgs.nur.repos.sagikazarmark.sf-pro #SF Pro font (NUR): https://github.dev/sagikazarmark/nix-config
    ubuntu_font_family
    font-awesome                    # for waybar icons
    font-awesome_5
    material-symbols                # waybar icon fonts
    noto-fonts-emoji
    nerdfonts
    jetbrains-mono
    roboto
    montserrat                      # for rofi
    cantarell-fonts                 # default font on ubuntu, used on gtklock
  ];
}
