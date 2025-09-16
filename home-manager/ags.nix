{ pkgs, inputs, config, lib, ... }:

with lib;

let
  cfg = config.module.bar.ags;
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
  cfgLibKompass = config.module.bar.ags.libkompass;
in
{
  options = {
    module.bar.ags.enable = mkEnableOption "Enables AGS";
    module.bar.ags.libkompass.enable = mkEnableOption "Enables libKompass used for app-launcher widget";
  };

  imports = [
    inputs.ags.homeManagerModules.default
  ];

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      material-symbols
      wf-recorder #screen recorder
    ];

    programs.ags = {
      enable = true;
      configDir = ../config/ags;
      extraPackages = with inputs.ags.packages.${pkgs.system}; [
        apps
        battery
        hyprland
        wireplumber
        network
        tray
        notifd
        mpris
        bluetooth
        powerprofiles
        # cava
        # auth
        pkgs.libgtop
      ] ++ lib.optionals cfgLibKompass.enable [
        inputs.kompass.packages.${pkgs.system}.libkompass
        river
        astal4
        pkgs.libadwaita
      ];
    };

    programs.bash.bashrcExtra = lib.mkIf (cfgBash.enable && cfgBashrc.enable) ''
      function ags () {
        if [ "$#" -eq 0 ]; then
          # No arguments: Run `ags run`
          command ags run
        elif [[ "$1" == "-q" || "$1" == "q" ]]; then
          # If the first argument is `-q`, replace it with `quit`
          shift  # Remove the first argument (`-q`)
          command ags quit "$@"
        else
          # Otherwise, pass all arguments as-is
          command ags "$@"
        fi
      }
    '';

    programs.fish.functions = lib.mkIf cfgFish.enable {
      ags = {
        body = ''
          if test (count $argv) -eq 0
            # No arguments: Run `ags run`
            command ags run
          else if test "$argv[1]" = "-q" -o "$argv[1]" = "q"
            # If the first argument is `-q`, replace it with `quit`
            command ags quit $argv[2..-1]
          else
            # Otherwise, pass all arguments as-is
            command ags $argv
          end
        '';
      };
    };
  };
}
