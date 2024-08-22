{ pkgs, lib, config, ... }:

with lib;

let
  cfg = config.module.xdg.defaultapps;
in
{
  options = {
    module.xdg.defaultapps.enable = mkEnableOption "Enables xdg mimeapps - default apps";
  };

  config = mkIf cfg.enable {
    xdg.configFile."mimeapps.list".force = true;
    xdg = {
      # cacheHome = "${config.home.homeDirectory}/.cache";
      # configHome = "${config.home.homeDirectory}/.config";
      # dataHome = "${config.home.homeDirectory}/.local/share";
      # stateHome = "${config.home.homeDirectory}/.local/state";

      # manage $XDG_CONFIG_HOME/mimeapps.list
      # xdg search all desktop entries from $XDG_DATA_DIRS, check it by command:
      #  echo $XDG_DATA_DIRS
      # the system-level desktop entries can be list by command:
      #   ls -l /run/current-system/sw/share/applications/
      # the user-level desktop entries can be list by command(user bajic):
      #  ls -l /etc/profiles/per-user/bajic/share/applications/
      mimeApps = {
        enable = true;
        # let `xdg-open` to open the url with the correct application.
        defaultApplications = let
          browser = [ "brave-browser.desktop" ];
          editor = [ "codium.desktop" ];
          editorHandler = [ "codium-url-handler.desktop" ];
          audio = [ "mpv.desktop" ];
          video = [ "mpv.desktop" ];
          image = [ "org.gnome.eog.desktop" ]; # || org.gnome.Loupe.desktop || org.gnome.Shotwell.desktop
        in {
          "application/json" = browser;
          "application/pdf" = browser;

          "text/html" = browser;
          "text/xml" = browser;
          "text/plain" = editor;
          "application/xml" = browser;
          "application/xhtml+xml" = browser;
          "application/xhtml_xml" = browser;
          "application/rdf+xml" = browser;
          "application/rss+xml" = browser;
          "application/x-extension-htm" = browser;
          "application/x-extension-html" = browser;
          "application/x-extension-shtml" = browser;
          "application/x-extension-xht" = browser;
          "application/x-extension-xhtml" = browser;
          "application/x-wine-extension-ini" = editor;

          # define default applications for some url schemes.
          "x-scheme-handler/about" = browser; # open `about:` url with `browser`
          "x-scheme-handler/ftp" = browser; # open `ftp:` url with `browser`
          "x-scheme-handler/http" = browser;
          "x-scheme-handler/https" = browser;
          # https://github.com/microsoft/vscode/issues/146408
          "x-scheme-handler/vscode" = editorHandler; # open `vscode://` url with `code-url-handler.desktop`
          "x-scheme-handler/vscode-insiders" = editorHandler; # open `vscode-insiders://` url with `code-insiders-url-handler.desktop`
          # all other unknown schemes will be opened by this default application.
          # "x-scheme-handler/unknown" = editor;

          # "x-scheme-handler/discord" = ["discord.desktop"];
          # "x-scheme-handler/tg" = ["org.telegram.desktop.desktop "];

          "audio/*" = audio;
          "video/*" = video;
          "image/*" = image;
          "image/gif" = image;
          "image/jpeg" = image;
          "image/png" = image;
          "image/webp" = image;
        };

        associations.removed = {
          # ......
        };
      };

      # userDirs = {
      #   enable = true;
      #   createDirectories = true;
      #   extraConfig = {
      #     XDG_SCREENSHOTS_DIR = "${config.xdg.userDirs.pictures}/Screenshots";
      #   };
      # };
    };
  };
}
