{ pkgs, ... }:

{
  fonts.fonts = with pkgs; [
    #$pkgs.nur.repos.sagikazarmark.sf-pro #SF Pro font (NUR): https://github.dev/sagikazarmark/nix-config
    ubuntu_font_family
    material-symbols      # icon fonts
    roboto
  ];
}
