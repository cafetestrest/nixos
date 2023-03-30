{ config, pkgs, ... }:

{
  home.file = {
    ".config/terminator/config".text = ''
[global_config]
  putty_paste_style = True
[keybindings]
[profiles]
  [[default]]
    cursor_color = "#aaaaaa"
    show_titlebar = False
[layouts]
  [[default]]
    [[[window0]]]
      type = Window
      parent = ""
    [[[child1]]]
      type = Terminal
      parent = window0
[plugins]
    '';
  };
}
