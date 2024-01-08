{ config, pkgs, lib, ...}:

let
  fromGitHub = rev: ref: repo: pkgs.vimUtils.buildVimPluginFrom2Nix {
    pname = "${lib.strings.sanitizeDerivationName repo}";
    version = ref;
    src = builtins.fetchGit {
      url = "https://github.com/${repo}.git";
      ref = ref;
      rev = rev;
    };
  };
in
{
  home.packages = with pkgs; [
    neovim
    vimPlugins.vim-plug
  ];

  programs.neovim = {
    enable = true;
    defaultEditor = false;
    viAlias = true;
    vimAlias = true;
    # configure = {
    #   # customRC = builtins.readFile ./config/init.vim;
    #   packages.nix = with pkgs.vimPlugins; {
    #     start = [
    #       # vim-surround # Shortcuts for setting () {} etc.
    #       # coc-nvim coc-git coc-highlight coc-python coc-rls coc-vetur coc-vimtex coc-yaml coc-html coc-json # auto completion
    #       # vim-nix # nix highlight
    #       # vimtex # latex stuff
    #       # fzf-vim # fuzzy finder through vim
    #       # nerdtree # file structure inside nvim
    #       # rainbow # Color parenthesis
    #       # novim-mode
    #       (fromGitHub "0e8e37a6c7b6f0ff2bbb27593d0b7c83c8ab91b9" "master" "tombh/novim-mode")
    #     ];
    #     opt = [];
    #   };
    # };
  };
}
