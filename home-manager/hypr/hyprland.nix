{ inputs, config, lib, pkgs, vars, ... }:

with lib;

let
  hyprland = inputs.hyprland.packages.${pkgs.system}.hyprland;
  portalPkgs = inputs.hyprland.packages.${pkgs.system}.xdg-desktop-portal-hyprland;
  plugins = inputs.hyprland-plugins.packages.${pkgs.system};
  mediaControl = "${pkgs.playerctl}/bin/playerctl";
  lock = "${pkgs.hyprlock}/bin/hyprlock";
  idle = "${pkgs.hypridle}/bin/hypridle";
  pamixer = "${pkgs.pamixer}/bin/pamixer";

  cfg = config.module.hypr.hyprland;
  cfgPkgs = config.module.hypr.hyprland.packages;
  cfgGnomePkgs = config.module.hypr.hyprland.gnome-packages;
  hyprlockCfg = config.module.screen-locker.hyprlock;
  # hypridleCfg = config.module.idle-inhibitor.hypridle;
in
{
  options = {
    module.hypr.hyprland.enable = mkEnableOption "Enables Hyprland config";
    module.hypr.hyprland.packages.enable = mkEnableOption "Enables Hyprland Packages";
    module.hypr.hyprland.gnome-packages.enable = mkEnableOption "Enables Hyprland Gnome Packages";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; lib.optionals cfgPkgs.enable [
      icon-library  #library of icons
      libnotify #notifications from terminal - notify-send
      killall
      loupe #image viewer
      grim                                #screenshot tool
      slurp                               #select a screenshot region
      hyprpicker                          #pipette - color hex picker
      wl-clipboard                        #clipboard copy/paste
    ] ++ lib.optionals cfgGnomePkgs.enable [
      nautilus                      #file manager
      gnome-text-editor
      gnome-calculator
      # gnome-font-viewer
      # gnome-disk-utility
      # gnome-characters              #check all characters, can be copied
      # adwaita-icon-theme
      # baobab
      gnome-calendar
      # gnome-boxes
      # gnome-system-monitor
      gnome-control-center
      # gnome-weather
      gnome-clocks
      # gnome-software # for flatpak
    ];

    wayland.windowManager.hyprland = {
      enable = true;
      package = hyprland;
      portalPackage = portalPkgs;
      #package = hyprland.override { debug = true; };
      systemd.enable = true;
      xwayland.enable = true;
      # plugins = with plugins; [ hyprbars borderspp ];

      settings = {
        exec-once = [
          "startup"
          # "nightlight a"
          # "${idle}"
          # "ags"
          # "openstartupapps"
          "hyprctl setcursor ${vars.gtk.cursorTheme} ${toString vars.gtk.cursorSize}"
          # "~/.config/scripts/111.sh"
          # "copyq --start-server"
          # ''hyprctl dispatch exec "xterm -e journalctl -xef"''
          # ''hyprctl dispatch exec "[workspace 2]" "xterm -e ~/.config/scripts/111.sh"''
        ];

        # exec = [
        #   "dbus-launch --sh-syntax --exit-with-session Hyprland"
        #   # "dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP=hyprland"
        # ];

        env = [
          "GDK_BACKEND,wayland"
          "GTK_THEME,${vars.gtk.gtkTheme}"
          # "XCURSOR_THEME,${vars.gtk.cursorTheme}"
          # "XCURSOR_SIZE,${toString vars.gtk.cursorSize}"
          "QT_QPA_PLATFORM,wayland"
          "QT_QPA_PLATFORMTHEME,qt5ct"
          "NIXOS_OZONE_WL,1"
          # Hyprcursor
          # "HYPRCURSOR_THEME, ${config.theme.cursor_name}"
          "HYPRCURSOR_SIZE,${toString vars.gtk.cursorSize}"
        ];

        monitor = [
          "DP-3, 3840x2160, 0x0, 1"
          # ",highres,auto,1"
        ];

        general = {
          layout = "dwindle";
          resize_on_border = true;
          gaps_in = 5;
          gaps_out = 10;
          border_size = 2;
          "col.active_border" = "rgba(33ccffee) rgba(00ff99ee) 45deg";
          "col.inactive_border" = "rgba(595959aa)";
        };

        misc = {
          # layers_hog_keyboard_focus = false;#If true, will make keyboard-interactive layers keep their focus on mouse move (e.g. wofi, bemenu)
          disable_splash_rendering = true;
          force_default_wallpaper = 0;
          disable_hyprland_logo = false;
        };

        input = {
          kb_layout = "us";
          follow_mouse = 1;
          numlock_by_default = true;
          touchpad = {
            natural_scroll = "no";
            disable_while_typing = true;
            drag_lock = true;
          };
          sensitivity = 0;
          # float_switch_override_focus = 2; #If enabled (1 or 2), focus will change to the window under the cursor when changing from tiled-to-floating and vice versa. If 2, focus will also follow mouse on float-to-float switches.
        };

        device = {
          name = "orochi-v2-mouse";
          sensitivity = -0.5;
        };

        binds = {
          allow_workspace_cycles = true;
        };

        dwindle = {
          pseudotile = "yes";
          preserve_split = "yes";
          # no_gaps_when_only = "yes";
        };

        gestures = {
          workspace_swipe = false;
          # workspace_swipe_forever = true;
          # workspace_swipe_numbered = true;
        };

        xwayland = {
          force_zero_scaling = true;
        };

        cursor = {
          hotspot_padding = 1;  #fixes issue that power menu toggle in ags is not far right
        };

        windowrule = let
          f = regex: "float, ^(${regex})$";
        in [
          "opacity 0.85,class:terminator"
          "move cursor -50% -20%,class:com.github.hluk.copyq"
          "move cursor -50% -20%,class:copyq"
          "size 350 200,class:com.github.hluk.copyq"
          "size 350 200,class:copyq"
        ];

        windowrulev2 = let
          stayfocused = regex: "stayfocused,class:${regex}";
          float = regex: "float,class:${regex}";
        in [
          (stayfocused "com.github.hluk.copyq")
          (stayfocused "copyq")
          (stayfocused "Rofi")
          (float "org.gnome.Calculator")
          (float "pavucontrol")
          (float "nm-connection-editor")
          (float "blueberry.py")
          (float "org.gnome.Settings")
          (float "org.gnome.design.Palette")
          (float "Color Picker")
          (float "xdg-desktop-portal")
          (float "xdg-desktop-portal-gnome")
          (float "transmission-gtk")
          (float "com.github.Aylur.ags")
          (float "com.github.hluk.copyq")
          (float "copyq")
          (float "jetbrains-phpstorm")
        ];

        # layerrule = let
        #   f = regex: "blur,${regex}";
        # in [
        #   (f "rofi")
        #   "noanim, lockscreen"
        #   "noanim, app-launcher"
        #   "noanim, bar"
        #   "noanim, control-center"
        #   "noanim, dashboard"
        #   "noanim, overview"
        #   "noanim, weather"
        #   "noanim, notifications"
        #   "noanim, notifications-popup"
        #   "noanim, osd"
        #   "noanim, popup-window"
        #   "noanim, powermenu"
        #   "noanim, verification"
        #   "noanim, transparent-scrim"
        # ];

        bind = let
          binding = mod: cmd: key: arg: "${mod}, ${key}, ${cmd}, ${arg}";
          mvfocus = binding "SUPER" "movefocus";
          ws = binding "SUPER" "workspace";
          mvactive = binding "SUPER ALT" "moveactive";
          mvtows = binding "SUPER SHIFT" "movetoworkspace";
          mvwin = binding "SUPER SHIFT" "movewindow";
          swapwin = binding "SUPER ALT" "swapwindow";
          e = "exec, ags";
          arr = [1 2 3 4 5 6 7 8 9];
          yt = pkgs.writeShellScriptBin "yt" ''
            notify-send "Opening video" "$(wl-paste)"
            mpv "$(wl-paste)"
          '';
          browser = "brave";
          fileExplorer = "nautilus";
        in [
          "SUPER, C, exec, ${browser}"
          "SUPER SHIFT, I, exec, ${browser} --incognito"
          "SUPER, T, exec, kitty -e fish -c 'cd ${vars.flakeLocation} && fastfetch; exec fish'"
          "SUPER, Return, exec, kitty"
          "SUPER, E, exec, ${fileExplorer}"
          "SUPER, V, exec, copyq toggle"
          # "SUPER, V, ${e} -t clipboard"
          "SUPER, Print, exec, screenshot"
          ",Print, exec, screenshot"
          "SUPER SHIFT, S, exec, screenshot 1"
          "SHIFT,Print, exec, screenshot 1"

          "SUPER SHIFT, R, ${e} quit; ags run"
          "SUPER, space, ${e} request 'toggle app-launcher'"
          "ALT, space, ${e} request 'toggle app-launcher'"
          # ", XF86PowerOff, ${e} -t powermenu"
          # "SUPER, Tab, ${e} -t overview"
          # ", XF86Launch4, ${e} -r 'recorder.start()'"
          # ",Print, ${e} -r 'recorder.screenshot()'"
          # "SHIFT,Print, ${e} -r 'recorder.screenshot(true)'"
          # "SUPER, Return, exec, xterm" # xterm is a symlink, not actually xterm
          "SUPER, L, ${e} request 'toggle powermenu'"
          "SUPER, N, ${e} request 'toggle notifications'"
          "SUPER SHIFT, N, ${e} request 'toggle weather'"
          "SUPER, S, ${e} request 'toggle control-center'"
          "CTRL ALT, Delete, exec, xterm -e powermenu t"
          "SUPER SHIFT, Delete, exec, xterm -e powermenu t"
          ''SUPER, Page_Up, exec, wpctl set-default $(wpctl status | grep "Digital Stereo (HDMI" | grep "\d+" -Po | head -n 1) && notify-send "Audio Output changed to HDMI"''
          "SUPER, Page_Down, exec, setaudiosource"
          # ''SUPER, Page_Down, exec, wpctl set-default $(wpctl status | grep "SteelSeries Arctis 7 Game" | grep "\d+" -Po | head -n 1) && notify-send "Audio Output changed to Headset"''
          "SUPER SHIFT, escape, exec, ${mediaControl} --all-players stop"

          # youtube
          # ", XF86Launch1, exec, ${yt}/bin/yt"

          # "ALT, Tab, focuscurrentorlast"
          "CTRL ALT, BackSpace, exit"
          "SUPER SHIFT, L, exit"
          "SUPER, Q, killactive"
          # "ALT, Q, killactive"
          "SUPER, F, togglefloating"
          "SUPER, M, fullscreen"
          # "SUPER SHIFT, M, fakefullscreen"
          "SUPER, J, togglesplit"
          "SUPER, P, pseudo"
          "SUPER SHIFT, P, workspaceopt, allpseudo"
          "SUPER SHIFT, F, workspaceopt, allfloat"
          "SUPER, 0, workspace, 10"
          "SUPER SHIFT, 0, movetoworkspace, 10"

          (mvfocus "up" "u")
          (mvfocus "down" "d")
          (mvfocus "right" "r")
          (mvfocus "left" "l")
          (ws "mouse_up" "e-1")
          (ws "mouse_down" "e+1")
          # (mvtows "left" "e-1")
          # (mvtows "right" "e+1")
          (mvactive "left" "-20 0")
          (mvactive "right" "20 0")
          (mvactive "down" "0 20")
          (mvactive "up" "0 -20")
          (mvwin "up" "u")
          (mvwin "down" "d")
          (mvwin "right" "r")
          (mvwin "left" "l")
          (swapwin "up" "u")
          (swapwin "down" "d")
          (swapwin "right" "r")
          (swapwin "left" "l")
        ]
        ++ (map (i: ws (toString i) (toString i)) arr)
        ++ (map (i: mvtows (toString i) (toString i)) arr);

        bindle = let e = "exec, ags"; in [
          # ",XF86MonBrightnessUp, ${e} 'brightness.screen += 0.05; indicator.display()'"
          # ",XF86MonBrightnessDown, ${e} 'brightness.screen -= 0.05; indicator.display()'"
          # ",XF86KbdBrightnessUp, ${e} 'brightness.kbd++; indicator.kbd()'"
          # ",XF86KbdBrightnessDown, ${e} 'brightness.kbd--; indicator.kbd()'"
          # ",XF86AudioRaiseVolume, ${e} 'audio.speaker.volume += 0.05; indicator.speaker()'"
          # ",XF86AudioLowerVolume, ${e} 'audio.speaker.volume -= 0.05; indicator.speaker()'"
          ",XF86AudioLowerVolume, exec, ${pamixer} -d 1"
          ",XF86AudioRaiseVolume, exec, ${pamixer} -i 1"
          ",XF86AudioMute, exec, ${pamixer} -t"
          "SUPER, Tab, cyclenext"
          "ALT, Tab, cyclenext"
          "SUPER SHIFT, Tab, cyclenext, prev"
          "ALT SHIFT, Tab, cyclenext, prev"
        ];

        binde = let
          binding = mod: cmd: key: arg: "${mod}, ${key}, ${cmd}, ${arg}";
          resizeactive = binding "SUPER CTRL" "resizeactive";
          resizeactivectrl = binding "SUPER SHIFT CTRL" "resizeactive";
        in [
          (resizeactive "right" "100 0")
          (resizeactive "left" "-100 0")
          (resizeactive "up" "0 -100")
          (resizeactive "down" "0 100")
          (resizeactivectrl "right" "10 0")
          (resizeactivectrl "left" "-10 0")
          (resizeactivectrl "up" "0 -10")
          (resizeactivectrl "down" "0 10")
        ];

        bindl = let e = "exec, ags"; in [
          # ",XF86AudioPlay, ${e} 'mpris?.playPause()'"
          # ",XF86AudioStop, ${e} 'mpris?.stop()'"
          # ",XF86AudioPause, ${e} 'mpris?.pause()'"
          # ",XF86AudioPrev, ${e} 'mpris?.previous()'"
          # ",XF86AudioNext, ${e} 'mpris?.next()'"
          ",XF86AudioMicMute, exec, ${pamixer} --default-source -t"
          ",XF86AudioPlay, exec, ${mediaControl} play-pause"
          ",XF86AudioStop, exec, ${mediaControl} stop"
          ",XF86AudioPause, exec, ${mediaControl} pause"
          ",XF86AudioPrev, exec, ${mediaControl} previous"
          ",XF86AudioNext, exec, ${mediaControl} next"
          # "SUPER, BackSpace, exec, pkill -SIGUSR1 swaylock && WAYLAND_DISPLAY=wayland-1 swaylock -f --grace 0"
        ] ++ lib.optionals hyprlockCfg.enable [
          "SUPER, BackSpace, exec, pkill -SIGUSR1 ${lock} && ${lock} --immediate"
        ];

        bindm = [
          "SUPER, mouse:273, resizewindow"
          "SUPER, mouse:272, movewindow"
        ];

        decoration = {
          rounding = 10;
          # dim_inactive = false;

          blur = {
            enabled = true;
            size = 3;
            passes = 1;
            new_optimizations = "on";
            # noise = 0.01;
            # contrast = 0.9;
            # brightness = 0.8;
          };
        };

        animations = {
          enabled = "yes";
          bezier = "myBezier, 0.05, 0.9, 0.1, 1.05";
          animation = [
            "windows, 1, 7, myBezier"
            "windowsOut, 1, 7, default, popin 80%"
            "border, 1, 10, default"
            "borderangle, 1, 8, default"
            "fade, 1, 7, default"
            "workspaces, 1, 6, default"
          ];
        };

        plugin = {
          hyprbars = {
            bar_color = "rgb(2a2a2a)";
            bar_height = 28;
            col_text = "rgba(ffffffdd)";
            bar_text_size = 11;
            bar_text_font = "Ubuntu Nerd Font";

            buttons = {
              button_size = 0;
              "col.maximize" = "rgba(ffffff11)";
              "col.close" = "rgba(ff111133)";
            };
          };
        };
      };
    };
  };
}
