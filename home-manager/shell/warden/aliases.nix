{ config, lib, ... }:

with lib;

let
  cfg = config.module.shell.warden.aliases;
in
{
  options = {
    module.shell.warden.aliases.enable = mkEnableOption "Enables warden aliases";
  };

  config = mkIf cfg.enable {
    home.shellAliases = {
      getwardenoutput = "get_warden_services_urls";
      printwardenoutput = "get_warden_services_urls";

      # #aliases for development
      b = "warden shell";
      # wenv = "warden env up";
      # wsvc = "warden svc up";
      start = "wardenstart";
      # wsvcdown = "warden svc down";
      # wenvdown = "warden env down";
      down = "wardendown";

      # #aliases for m2 warden
      app = ''warden shell -c "$1"'';
      # php = "app php $1";
      cg = "app rm -rf /var/www/html/generated/code/ /var/www/html/generated/metadata/";
      # composer = ''warden shell -c "COMPOSER_MEMORY_LIMIT=-1 composer $1"'';
      cud = "composer update";
      cu = "cud --no-dev";
      cid = "COMPOSER_MEMORY_LIMIT=-1 composer install";
      ci = "cid --no-dev";
      grunt = ''warden shell -c "grunt $1"'';
      gw = "grunt watch";
      node = ''warden shell -c "node $1"'';
      yarn = ''warden shell -c "yarn $1"'';
      npx = ''warden shell -c "npx $1"'';
      # gccomposer = "app git checkout composer.lock";
      #gcconfig = "app git checkout app/etc/config.php";
      # vsb = "app varnish-static-ban";
      # vsba = "vsb "\.*"";
      # vsbc = "vsb "\.*\.css"";
      # vsbh = "vsb "\.*\.html"";
      # vsbj = "vsb "\.*\.js"";

      m2 = ''warden shell -c "php -dmemory_limit=-1 bin/magento $1"'';
      magento = "m2";
      msu = "m2 setup:upgrade";
      sup = "msu";
      cc = ''m2 cache:clean $1'';
      cf = "m2 cache:flush";
      ccc = "m2 cache:clean config full_page";
      ccfe = "m2 cache:clean block_html layout full_page";
      dc = "m2 setup:di:compile";
      scd = "m2 setup:static-content:deploy -f --jobs 6";
      static = "scd";
      scd1 = "m2 setup:static-content:deploy -f";
      rebuild = "msu && cf";
      rebuild1 = "msu && dc && scd1 && cf";
      rebuild6 = "msu && dc && scd && cf";
      rebuildprod = "rebuild6";
      rebuildprod1 = "rebuild1";
      rei = "m2 indexer:reindex";
      res = "m2 indexer:reset";
      rebuildfull = "msu && dc && scd && res && rei && cf";

      #testing
      # testing = "open_in_browser";
    };
  };
}
