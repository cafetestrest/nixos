{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.librewolf;
in
{
  options = {
    module.packages.librewolf.enable = mkEnableOption "Enables librewolf browser";
  };

  config = mkIf cfg.enable {
    programs.librewolf = {
      enable = true;
      policies = {
        DisableTelemetry = true;
        DisableFirefoxStudies = true;
        Preferences = {
          "browser.tabs.groups.enabled" = true; # enable tab groups
        };
        ExtensionSettings = {
          "uBlock0@raymondhill.net" = {
            install_url = "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi";
            installation_mode = "force_installed";
          };
        };
      };
    };
  };
}
