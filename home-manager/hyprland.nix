{ inputs, pkgs, ... }:
let
  hyprland = inputs.hyprland.packages.${pkgs.system}.hyprland;
  plugins = inputs.hyprland-plugins.packages.${pkgs.system};

  launcher = pkgs.writeShellScriptBin "hypr" ''
    #!/${pkgs.bash}/bin/bash

    export WLR_NO_HARDWARE_CURSORS=1
    export _JAVA_AWT_WM_NONREPARENTING=1

    exec ${hyprland}/bin/Hyprland
  '';
in
{
  home.packages = [ launcher ];

#   xdg.desktopEntries."org.gnome.Settings" = {
#     name = "Settings";
#     comment = "Gnome Control Center";
#     icon = "org.gnome.Settings";
#     exec = "env XDG_CURRENT_DESKTOP=gnome ${pkgs.gnome.gnome-control-center}/bin/gnome-control-center";
#     categories = [ "X-Preferences" ];
#     terminal = false;
#   };

  wayland.windowManager.hyprland = {
    enable = true;
    package = hyprland;
    systemd.enable = true;
    xwayland.enable = true;
    # plugins = with plugins; [ hyprbars borderspp ];

    settings = {
      exec-once = [
        # "ags -b hypr"
        "~/.config/scripts/startup.sh"  #open on startup
        "xrdb -load ~/.Xresources"
        # "hyprctl setcursor Qogir 24"
        # "transmission-gtk"
      ];

      monitor = [
        # "eDP-1, 1920x1080, 0x0, 1"
        # "HDMI-A-1, 2560x1440, 1920x0, 1"
        ",preferred,auto,1"
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
        layers_hog_keyboard_focus = false;#todo check?
        disable_splash_rendering = true;
        force_default_wallpaper = 0;
        disable_hyprland_logo = true;
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
        float_switch_override_focus = 2; #todo ?
      };

      binds = {
        allow_workspace_cycles = true;
      };

      dwindle = {
        pseudotile = "yes";
        preserve_split = "yes";
        # force_split = 0; #todo maybe?
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

      windowrule = let
        f = regex: "float, ^(${regex})$";
      in [
		(f "org.gnome.Calculator")
		# (f "org.gnome.Nautilus")
		(f "pavucontrol")
		(f "nm-connection-editor")
		(f "blueberry.py")
		(f "org.gnome.Settings")
		(f "org.gnome.design.Palette")
		(f "Color Picker")
		(f "xdg-desktop-portal")
		(f "xdg-desktop-portal-gnome")
		(f "transmission-gtk")
		(f "com.github.Aylur.ags")
		(f "com.github.hluk.copyq")
		"float,Rofi"
		# "workspace 7, title:Spotify"
		"opacity 0.85,terminator"
		"move cursor -50% -20%,^(com.github.hluk.copyq)$"
      ];

      windowrulev2 = let
        f = regex: "stayfocused,class:${regex}";
      in [
		(f "com.github.hluk.copyq")
		(f "Rofi")
      ];

      layerrule = let
        f = regex: "blur,${regex}";
      in [
		(f "rofi")
      ];

      bind = let
        binding = mod: cmd: key: arg: "${mod}, ${key}, ${cmd}, ${arg}";
        mvfocus = binding "SUPER" "movefocus";
        ws = binding "SUPER" "workspace";
        resizeactive = binding "SUPER SHIFT CTRL" "resizeactive";
        resizeactivectrl = binding "SUPER SHIFT CTRL" "resizeactive";
        mvactive = binding "SUPER ALT" "moveactive";
        mvtows = binding "SUPER SHIFT" "movetoworkspace";
        e = "exec, ags -b hypr";
        arr = [1 2 3 4 5 6 7 8 9];
        yt = pkgs.writeShellScriptBin "yt" ''
            notify-send "Opening video" "$(wl-paste)"
            mpv "$(wl-paste)"
        '';
        browser = "chromium";
        fileExplorer = "nautilus";
      in [
        "SUPER, C, exec, ${browser}"
        "SUPER SHIFT, I, exec, ${browser} --incognito"
        "SUPER, T, exec, terminator"
        "SUPER, E, exec, ${fileExplorer}"
        "SUPER, V, exec, copyq menu"
        "SUPER, Print, exec, ~/.config/scripts/screenshot.sh"
        "SUPER SHIFT, S, exec, ~/.config/scripts/screenshot.sh 1"

        "SUPER SHIFT, R, ${e} quit; ags -b hypr"
        "SUPER, space,   ${e} -t applauncher"
        "ALT, space,   ${e} -t applauncher"
        # ", XF86PowerOff, ${e} -t powermenu"
        # "SUPER, Tab,     ${e} -t overview"
        # ", XF86Launch4,  ${e} -r 'recorder.start()'"
        ",Print,         ${e} -r 'recorder.screenshot()'"
        "SHIFT,Print,    ${e} -r 'recorder.screenshot(true)'"
        # "SUPER, Return, exec, xterm" # xterm is a symlink, not actually xterm
        "SUPER, L,   ${e} -t powermenu"
        "SUPER, N,   ${e} -t weather"
        "SUPER, S,   ${e} -t quicksettings"
        "CTRL ALT, Delete, exec, xterm -e ~/.config/scripts/powermenu.sh t"
        "SUPER SHIFT, Delete, exec, xterm -e ~/.config/scripts/powermenu.sh t"
        ''SUPER, Page_Up, exec, wpctl set-default $(wpctl status | grep "Digital Stereo (HDMI" | grep "\d+" -Po | head -n 1) && notify-send "Audio Output changed to HDMI"''
        ''SUPER, Page_Down, exec, wpctl set-default $(wpctl status | grep "SteelSeries Arctis 7 Game" | grep "\d+" -Po | head -n 1) && notify-send "Audio Output changed to Headset"''
        "SUPER SHIFT, escape, exec, playerctl --all-players stop"

        # youtube
        # ", XF86Launch1,  exec, ${yt}/bin/yt"

        "SUPER, Tab, cyclenext"
        "ALT, Tab, cyclenext"
        "SUPER SHIFT, Tab, cyclenext, prev"
        "ALT SHIFT, Tab, cyclenext, prev"
        # "ALT, Tab, focuscurrentorlast"
        "CTRL ALT, BackSpace, exit"
        "SUPER SHIFT, L, exit"
        "SUPER, Q, killactive"
        # "ALT, Q, killactive"
        "SUPER, F, togglefloating"
        "SUPER, M, fullscreen"
        "SUPER SHIFT, M, fakefullscreen"
        "SUPER, P, togglesplit"
        "SUPER, P, pseudo"
        "SUPER SHIFT, P, workspaceopt, allpseudo"
        "SUPER SHIFT, F, workspaceopt, allfloat"

        (mvfocus "up" "u")
        (mvfocus "down" "d")
        (mvfocus "right" "r")
        (mvfocus "left" "l")
        (ws "left" "e-1")
        (ws "right" "e+1")
        (mvtows "left" "e-1")
        (mvtows "right" "e+1")
        (resizeactive "right" "100 0")
        (resizeactive "left" "-100 0")
        (resizeactive "up" "0 -100")
        (resizeactive "down" "0 100")
        (resizeactivectrl "right" "10 0")
        (resizeactivectrl "left" "-10 0")
        (resizeactivectrl "up" "0 -10")
        (resizeactivectrl "down" "0 10")
        (mvactive "right" "-20 0")
        (mvactive "left" "20 0")
        (mvactive "up" "0 20")
        (mvactive "down" "0 -20")
      ]
      ++ (map (i: ws (toString i) (toString i)) arr)
      ++ (map (i: mvtows (toString i) (toString i)) arr);

      bindle = let e = "exec, ags -b hypr -r"; in [
        # ",XF86MonBrightnessUp,   ${e} 'brightness.screen += 0.05; indicator.display()'"
        # ",XF86MonBrightnessDown, ${e} 'brightness.screen -= 0.05; indicator.display()'"
        ",XF86KbdBrightnessUp,   ${e} 'brightness.kbd++; indicator.kbd()'"
        ",XF86KbdBrightnessDown, ${e} 'brightness.kbd--; indicator.kbd()'"
        # ",XF86AudioRaiseVolume,  ${e} 'audio.speaker.volume += 0.05; indicator.speaker()'"
        # ",XF86AudioLowerVolume,  ${e} 'audio.speaker.volume -= 0.05; indicator.speaker()'"
        ",XF86AudioLowerVolume, exec, pamixer -d 1"
        ",XF86AudioRaiseVolume, exec, pamixer -i 1"
        ",XF86AudioMute, exec, pamixer -t"
      ];

      bindl = let e = "exec, ags -b hypr -r"; in [
        # ",XF86AudioPlay,    ${e} 'mpris?.playPause()'"
        # ",XF86AudioStop,    ${e} 'mpris?.stop()'"
        # ",XF86AudioPause,   ${e} 'mpris?.pause()'"
        # ",XF86AudioPrev,    ${e} 'mpris?.previous()'"
        # ",XF86AudioNext,    ${e} 'mpris?.next()'"
        ",XF86AudioMicMute, ${e} 'audio.microphone.isMuted = !audio.microphone.isMuted'"
        ",XF86AudioPlay, exec, playerctl play-pause"
        ",XF86AudioStop, exec, playerctl stop"
        ",XF86AudioPause, exec, playerctl pause"
        ",XF86AudioPrev, exec, playerctl previous"
        ",XF86AudioNext, exec, playerctl stop"
      ];

      bindm = [
        "SUPER, mouse:273, resizewindow"
        "SUPER, mouse:272, movewindow"
      ];

      decoration = {
        rounding = 10;

        drop_shadow = "yes";
        shadow_range = 4;
        shadow_render_power = 3;
        "col.shadow" = "rgba(1a1a1aee)";

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
}