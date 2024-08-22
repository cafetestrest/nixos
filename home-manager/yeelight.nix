{ config, lib, pkgs, vars, ... }:

with lib;

let
  getyeelightip = pkgs.writeShellApplication {
    name = "getyeelightip";
    text = builtins.readFile ../config/scripts/getyeelightip.sh;
  };

  cfg = config.module.scripts.yeelight;
in
{
  options = {
    module.scripts.yeelight.enable = mkEnableOption "Enables yeelight scripts";
  };

  config = mkIf cfg.enable {
    xdg = {
      configFile = {
        "scripts/yeelight" = {
          source = fetchGit {
            url = "https://github.com/darth-hp/yeelight-shell-scripts";
            rev = "${vars.commit.yeelightShellScriptsGitRev}";
          };
          recursive = true; #making it imperative so I can add yeelight-ips file
        };
      };
    };

    home.packages = [ getyeelightip ];

    home.shellAliases = {
      yeelight-colortemp = "/home/${vars.user}/.config/scripts/yeelight/yeelight-colortemp.sh";
      yeelight-hue = "/home/${vars.user}/.config/scripts/yeelight/yeelight-hue.sh";
      yeelight-redshift = "/home/${vars.user}/.config/scripts/yeelight/yeelight-redshift.sh";
      yeelight-scene = "/home/${vars.user}/.config/scripts/yeelight/yeelight-scene.sh";
      yeelight = "/home/${vars.user}/.config/scripts/yeelight/yeelight.sh";
      yeelight-brightness = "/home/${vars.user}/.config/scripts/yeelight/yeelight-brightness.sh";
      yeelight-disco = "/home/${vars.user}/.config/scripts/yeelight/yeelight-disco.sh";
      yeelight-rgb = "/home/${vars.user}/.config/scripts/yeelight/yeelight-rgb.sh";
      yeelight-toggle = "/home/${vars.user}/.config/scripts/yeelight/yeelight-toggle.sh";
    };
  };
}
