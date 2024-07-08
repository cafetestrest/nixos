{ config, pkgs, vars, ... }:

let
  getyeelightip = pkgs.writeShellApplication {
    name = "getyeelightip";
    text = builtins.readFile ../config/scripts/getyeelightip.sh;
  };
in
{
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
}
