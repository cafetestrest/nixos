{ config, pkgs, ... }:

let
  monitor = pkgs.writeShellApplication {
    name = "monitor";
    # runtimeInputs = with pkgs; [cowsay lolcat];

    # text = ''
    #   cowsay "join our discord" | lolcat
    # '';
    text = builtins.readFile ../../config/scripts/monitor.sh;
  };
in
{
  home.packages = [ monitor ];
}
