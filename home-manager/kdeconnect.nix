{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.kdeconnect;
in
{
  options = {
    module.packages.kdeconnect.enable = mkEnableOption "Enables kdeconnect";
  };

  config = mkIf cfg.enable {
    #KDE Connect
    services = {
      kdeconnect = {
        enable = true;
        indicator = true;
      };
    };

    home = {
      sessionVariables = {
        QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      };
    };
  };
}
