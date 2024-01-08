{ config, lib, pkgs, ... }:

let
  makeTerminatorConfig = {
    global_config = {
      inactive_color_offset = 0.5064935064935064;
      putty_paste_style = true;
    };

    keybindings = {
      new_tab = "<Primary>t";
      cycle_next = "<Primary>Page_Up";
      cycle_prev = "<Primary>Page_Down";
      close_term = "<Primary>w";
      next_tab = "<Primary>Tab";
      prev_tab = "<Primary><Shift>Tab";
      preferences = "F1";
      help = "<Primary>F1";
    };

    profiles = {
      default = {
        font = "JetBrains Mono Regular 10";
        show_titlebar = false;
        use_theme_colors = true;
        use_system_font = false;
        copy_on_selection = true;
      };
    };

    layouts = {
      default = {
        window0 = {
          type = "Window";
          parent = "";
          size = "700,420";
        };

        child1 = {
          type = "Terminal";
          parent = "window0";
        };
      };
    };
  };
in
{
  programs.terminator = {
    enable = true;
    # extraPackages = [ pkgs.terminatorThemes ]; # Optional: For additional themes
    config = makeTerminatorConfig;
  };
}