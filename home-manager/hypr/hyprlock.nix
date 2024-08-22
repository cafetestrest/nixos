{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.screen-locker.hyprlock;
in
{
  options = {
    module.screen-locker.hyprlock.enable = mkEnableOption "Enables hyprlock config";
  };

  config = mkIf cfg.enable {
    # home.packages = with pkgs; [ unstable.hyprlock ];

    xdg.configFile."hypr/hyprlock.conf".text = ''
      general{

      }
      #TODO add support for this image
      background {
          monitor =
          path=/etc/nixos/hyprlock.png
          # all these options are taken from hyprland, see https://wiki.hyprland.org/Configuring/Variables/#blur for explanations
          blur_passes = 1 # 0 disables blurring
          blur_size = 1
          new_optimizations = true
          ignore_opacity = false
      }

      input-field {
          monitor =
          size = 190, 30
          outline_thickness = 2
          dots_size = 0.33 # Scale of input-field height, 0.2 - 0.8
          dots_spacing = 0.15 # Scale of dots' absolute size, 0.0 - 1.0
          dots_center = true
          outer_color = rgba(40,40,40,0.0)
          inner_color = rgba(200, 200, 200, 0.8)
          font_color = rgba(10, 10, 10, 0.8)
          fade_on_empty = false
          placeholder_text = Enter Password # Text rendered in the input box when it's empty.
          hide_input = false

          position = 0, 170
          halign = center
          valign = bottom
      }

      label {
          monitor =
          text = cmd[update:1000] echo "<span>$(date '+%A, %d %B')</span>"
          # text = cmd[update:1000] echo "<span foreground='##eeeeee'>$(date '+%A, %d %B')</span>"
          color = rgba(250, 250, 250, 0.8)
          font_size = 40
          font_family = Roboto

          position = 0, -200
          halign = center
          valign = top
      }

      label {
          monitor =
          text = cmd[update:1000] echo "<span>$(date '+%H:%M')</span>"
          color = rgba(250, 250, 250, 0.8)
          font_size = 190
          font_family = Roboto,Bold

          position = 0, -250
          halign = center
          valign = top
      }

      label {
          monitor =
          text =    $USER
          color = rgba(200, 200, 200, 1.0)
          font_size = 18
          font_family = Roboto

          position = 0, 240
          halign = center
          valign = bottom
      }
      '';

    # programs.hyprlock = {
    # enable = true;

    # general = {
    #   grace = 5;
    #   hide_cursor = true;
    # };

    # backgrounds = [{
    #   path = "${theme.wallpaper}";
    #   blur_passes = 2;
    #   blur_size = 6;
    # }];

    # input-fields = [{
    #   size.width = 250;
    #   outer_color = "rgb(${hexToRgb colours.black})";
    #   inner_color = "rgb(${hexToRgb colours.bgDark})";
    #   font_color = "rgb(${hexToRgb colours.purple})";
    #   placeholder_text = "";
    # }];

    # labels = [
    #   {
    #     text = "Hello";
    #     color = "rgba(${hexToRgb colours.text}, 1.0)";
    #     font_family = theme.fonts.default.name;
    #     font_size = 64;
    #   }
    #   {
    #     text = "$TIME";
    #     color = "rgba(${hexToRgb colours.subtext1}, 1.0)";
    #     font_family = theme.fonts.default.name;
    #     font_size = 32;
    #     position.y = 160;
    #   }
    # ];
    # };
  };
}
