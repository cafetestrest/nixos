{ pkgs, ... }:

{
  fonts.fonts = with pkgs; [
    pkgs.nur.repos.sagikazarmark.sf-pro #SF Pro font (NUR): https://github.dev/sagikazarmark/nix-config
  ];
}
