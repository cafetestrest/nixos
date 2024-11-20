{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.yazi;
in
{
  options = {
    module.packages.yazi.enable = mkEnableOption "Enables yazi";
  };

  config = mkIf cfg.enable {
    programs.yazi = {
      enable = true;
    };

    home.shellAliases = {
      f = "yazi";
    };

    home.file."${config.xdg.configHome}/yazi/keymap.toml".text =
    /*
    toml
    */
    ''
      [[manager.prepend_keymap]]
      on   = [ "<C-q>" ]
      run  = "close"
      desc = "Close the current tab, or quit if it is last tab"
    '';
  };
}
