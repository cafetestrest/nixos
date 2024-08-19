{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    stable.jetbrains.phpstorm    #phpstorm PHP editor
    # postman             #postman for API calls
  ];

  # home.shellAliases = {
  #   # www = "cd ~/Sites";
  #   # storm = "pstorm";
  #   # phpstorm = "pstorm";
  # };
}
