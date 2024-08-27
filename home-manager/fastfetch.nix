{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.packages.fastfetch;
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
in
{
  options = {
    module.packages.fastfetch.enable = mkEnableOption "Enables fastfetch";
  };

  config = mkIf cfg.enable {
    programs.fastfetch = {
      enable = true;
      settings = {
        logo = {
          padding = {
            top = 0;
          };
        };
        modules = [
          "title"
          # "separator"
          "os"
          "host"
          "kernel"
          "uptime"
          "packages"
          "shell"
          # "display"
          "de"
          "wm"
          "wmtheme"
          "theme"
          "icons"
          # "font"
          "cursor"
          "terminal"
          "terminalfont"
          "cpu"
          "gpu"
          "memory"
          "disk"
          # "localip"
          # "battery"
          # "poweradapter"
          # "locale"
          "break"
          "colors"
        ];
      };
    };

    home.shellAliases = {
      neofetch = "fastfetch";
    };

    programs.bash.bashrcExtra = lib.mkIf (cfgBash.enable && cfgBashrc.enable) ''
      if [[ $(whoami) == "${vars.user}" && -d "${vars.flakeLocation}" ]]; then
        cd "${vars.flakeLocation}"
        fastfetch
      fi
    '';

    programs.fish.functions = lib.mkIf cfgFish.enable {
      fish_greeting = {
        body = ''
          if [ (whoami) = "${vars.user}" ]
            if [ -d "${vars.flakeLocation}" ]
              cd "${vars.flakeLocation}"
            end
            fastfetch
          end
        '';
        onEvent = "fish_greeting";
      };
    };
  };
}
