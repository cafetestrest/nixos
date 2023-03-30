{ config, pkgs, ... }:

{
  home.file = {
    ".config/terminator/config".text = ''
[global_config]
  inactive_color_offset = 0.5064935064935064
  putty_paste_style = True
[keybindings]
  new_tab = <Primary>t
  cycle_next = <Primary>Page_Up
  cycle_prev = <Primary>Page_Down
  close_term = <Primary>w
  next_tab = <Primary>Tab
  prev_tab = <Primary><Shift>Tab
  preferences = F1
  help = <Primary>F1
[profiles]
  [[default]]
    show_titlebar = False
    use_theme_colors = True
    copy_on_selection = True
[layouts]
  [[default]]
    [[[window0]]]
      type = Window
      parent = ""
      size = 700, 420
    [[[child1]]]
      type = Terminal
      parent = window0
[plugins]
    '';
  };
}
