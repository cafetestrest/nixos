{ config, pkgs, ... }:

{
  home.shellAliases = {
    ".." = "cd ..";
    "..." = "cd ../..";
    "...." = "cd ../../..";
    "....." = "cd ../../../..";
    "......" = "cd ../../../../..";
    cls = "clear";
    cl = "clear";
    f = "yazi";

    #docker aliases
    dockerprune = "dockerpruneall";
    # getetchostsfromurl = "get_etc_hosts_domains_from_url $1";
  };
}
