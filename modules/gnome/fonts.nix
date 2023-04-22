{ pkgs, ... }:

{
  fonts.fonts = with pkgs; [
    #$pkgs.nur.repos.sagikazarmark.sf-pro #SF Pro font (NUR): https://github.dev/sagikazarmark/nix-config
    ubuntu_font_family
    font-awesome                    #for waybar icons
    font-awesome_5
    unstable.material-symbols       # waybar icon fonts
    noto-fonts-emoji
    nerdfonts
    jetbrains-mono
    roboto
  ];
}
