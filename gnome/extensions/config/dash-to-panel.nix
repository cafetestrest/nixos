{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/dash-to-panel" = {
      animate-appicon-hover-animation-extent="{'RIPPLE': 4, 'PLANK': 4, 'SIMPLE': 1}";
      appicon-margin=4;
      appicon-padding=4;
      available-monitors=[0];
      dot-style-focused="METRO";
      dot-style-unfocused="DASHES";
      hotkeys-overlay-combo="TEMPORARILY";
      leftbox-padding=-1;
      panel-anchors=''{"0":"MIDDLE"}'';
      panel-element-positions=''{"0":[{"element":"showAppsButton","visible":true,"position":"stackedTL"},{"element":"activitiesButton","visible":false,"position":"stackedTL"},{"element":"leftBox","visible":true,"position":"stackedTL"},{"element":"taskbar","visible":true,"position":"stackedTL"},{"element":"dateMenu","visible":true,"position":"centerMonitor"},{"element":"centerBox","visible":true,"position":"centerMonitor"},{"element":"rightBox","visible":true,"position":"stackedBR"},{"element":"systemMenu","visible":true,"position":"stackedBR"},{"element":"desktopButton","visible":false,"position":"stackedBR"}]}'';
      panel-lengths=''{"0":100}'';
      panel-positions=''{"0":"TOP"}'';
      panel-sizes=''{"0":29}'';
      primary-monitor=0;
      scroll-panel-action="CHANGE_VOLUME";
      status-icon-padding=-1;
      tray-padding=-1;
      window-preview-title-position="TOP";
    };
  };
}
