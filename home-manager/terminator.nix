{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.terminator;

  makeTerminatorConfig = {
    global_config = {
      inactive_color_offset = 0.5064935064935064;
      putty_paste_style = true;
    };

    keybindings = {
      new_tab = "<Primary>t";
      cycle_next = "<Primary>Page_Up";
      cycle_prev = "<Primary>Page_Down";
      close_term = "<Primary><Shift>w";
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
  options = {
    module.terminator.enable = mkEnableOption "Terminator terminal";
  };

  config = mkIf cfg.enable {
    programs.terminator = {
      enable = true;
      # extraPackages = [ pkgs.terminatorThemes ]; # Optional: For additional themes
      config = makeTerminatorConfig;
    };
  };
}

# [global_config]
# inactive_color_offset = "0.506494"
# putty_paste_style = True
# [keybindings]
# close_term = "<Primary><Shift>w"
# cycle_next = "<Primary>Page_Up"
# cycle_prev = "<Primary>Page_Down"
# help = "<Primary>F1"
# new_tab = "<Primary>t"
# next_tab = "<Primary>Tab"
# preferences = "F1"
# prev_tab = "<Primary><Shift>Tab"
# [layouts]
# [[default]]
# [[[child1]]]
# parent = "window0"
# type = "Terminal"
# [[[window0]]]
# parent = ""
# type = "Window"
# [profiles]
# [[default]]
# copy_on_selection = True
# font = "JetBrains Mono Regular 10"
# show_titlebar = False
# use_system_font = False
# use_theme_colors = True
