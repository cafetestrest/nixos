{ pkgs, inputs, config, lib, ... }:

with lib;

let
  cfg = config.module.bar.ags;
in
{
  options = {
    module.bar.ags.enable = mkEnableOption "Enables AGS";
  };

  imports = [
    inputs.ags.homeManagerModules.default
  ];

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      inputs.ags.packages.${pkgs.system}.notifd
      inputs.ags.packages.${pkgs.system}.mpris
      # inputs.ags.packages.${pkgs.system}.auth
      # inputs.matugen.packages.${pkgs.system}.default
      material-symbols
      wf-recorder #screen recorder
    ];

    programs.ags = {
      enable = true;
      configDir = ../config/ags;
      extraPackages = [
        pkgs.libsoup_3
        pkgs.gtksourceview
        pkgs.libnotify
        pkgs.webkitgtk_4_1
        pkgs.gst_all_1.gstreamer
        inputs.ags.packages.${pkgs.system}.apps
        # inputs.ags.packages.${pkgs.system}.battery
        inputs.ags.packages.${pkgs.system}.hyprland
        inputs.ags.packages.${pkgs.system}.wireplumber
        inputs.ags.packages.${pkgs.system}.network
        inputs.ags.packages.${pkgs.system}.tray
        inputs.ags.packages.${pkgs.system}.notifd
        inputs.ags.packages.${pkgs.system}.mpris
        inputs.ags.packages.${pkgs.system}.bluetooth
        # inputs.ags.packages.${pkgs.system}.auth
      ];
    };
  };
}
