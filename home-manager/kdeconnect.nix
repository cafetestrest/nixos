{ config, pkgs, ... }:

{
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
}
