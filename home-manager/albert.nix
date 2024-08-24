{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.albert;
in
{
  options = {
    module.packages.albert.enable = mkEnableOption "Enables albert";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      albert              #keybinding for albert toggle to get programs search
    ];

    home.file = {
      ".config/albert/albert.conf".text = ''
        [General]
        frontendId=org.albert.frontend.widgetboxmodel
        hotkey=Alt+Space
        showTray=true

        [org.albert.extension.applications]
        enabled=true

        [org.albert.extension.calculator]
        enabled=true

        [org.albert.extension.chromium]
        bookmarks_path=/home/bajic/.config/chromium/Default/Bookmarks
        enabled=false

        [org.albert.extension.files]
        enabled=false

        [org.albert.extension.hashgenerator]
        enabled=true

        [org.albert.extension.mpris]
        enabled=false

        [org.albert.extension.python]
        enabled=false

        [org.albert.extension.snippets]
        enabled=false

        [org.albert.extension.ssh]
        enabled=false

        [org.albert.extension.system]
        enabled=true

        [org.albert.extension.terminal]
        enabled=true

        [org.albert.frontend.qmlboxmodel]
        alwaysOnTop=true
        clearOnHide=false
        hideOnClose=false
        hideOnFocusLoss=true
        showCentered=true
        stylePath=/nix/store/d0bimcyxmf23div429a30ll7xj1yd2sf-albert-0.17.6/share/albert/org.albert.frontend.qmlboxmodel/styles/BoxModel/MainComponent.qml
        windowPosition=@Point(1569 838)

        [org.albert.frontend.widgetboxmodel]
        alwaysOnTop=true
        clearOnHide=false
        displayIcons=true
        displayScrollbar=false
        displayShadow=true
        hideOnClose=false
        hideOnFocusLoss=true
        itemCount=10
        showCentered=true
        theme=Spotlight Dark
      '';
    };
  };
}
