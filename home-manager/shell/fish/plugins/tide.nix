{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish.plugins.tide;
in
{
  options = {
    module.shell.fish.plugins.tide.enable = mkEnableOption "Enables tide fish plugin";
  };

  config = mkIf cfg.enable {
    programs.fish = {
      plugins = [
        { name = "tide"; src = pkgs.fishPlugins.tide.src; }
      ];

      shellInit = ''
        set -g tide_character_icon "⋊>"
        set -g tide_character_color 0DCDCD
        set -g tide_pwd_color_anchors CECB00
        set -g tide_pwd_color_dirs CECB00
      '';

    };

    home.activation.configure-tide = lib.hm.dag.entryAfter ["writeBoundary"] ''
      ${pkgs.fish}/bin/fish -c "tide configure --auto --style=Lean --prompt_colors='True color' --show_time='24-hour format' --lean_prompt_height='One line' --prompt_spacing=Compact --icons='Few icons' --transient=No"
    '';
  };
}
