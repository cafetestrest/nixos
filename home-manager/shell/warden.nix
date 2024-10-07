{ config, lib, ... }:

with lib;

let
  cfg = config.module.shell.warden;
  cfgAliases = config.module.shell.warden.aliases;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
in
{
  options = {
    module.shell.warden.enable = mkEnableOption "Enables warden aliases";
    module.shell.warden.aliases.enable = mkEnableOption "Enables warden aliases";
  };

  config = mkMerge [
    (mkIf (cfg.enable && cfgAliases.enable) {
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
    })

    (mkIf (cfg.enable && cfgFish.enable) {
      programs.fish = {
        functions = {
          wardenstart = {
            body = ''
              warden svc up
              warden env up
              get_warden_services_urls
            '';
          };

          wardendown = {
            body = ''
              warden svc down
              if [ (count $argv) -gt 0 ]
                warden env down $arg
              else
                warden env down
              end
            '';
          };

          get_warden_services_urls = {
            body = ''
              if [ -e ./.env ]
                echo ""
                echo "==> [$(date +%H:%M:%S)] Started warden"
                echo ""
                set FILL (string repeat -n 128 -)
                set LONGEST_STRING_FOR_C1 AdminURL
                set PRINT_MORE_VERBOSE_URLS 1
                set PRINT_ADMIN_INFO 0
                set HTTP_PROTOCOL https
                set ADMIN_PATH admin
                set ADMIN_USER admin
                set ADMIN_PASS Test1234
                set TRAEFIK_DOMAIN (grep -w TRAEFIK_DOMAIN ./.env | cut -d "=" -f2)
                set TRAEFIK_SUBDOMAIN (grep -w TRAEFIK_SUBDOMAIN ./.env | cut -d "=" -f2)
                set WARDEN_RABBITMQ (grep -w WARDEN_RABBITMQ ./.env | cut -d "=" -f2)
                set WARDEN_ELASTICSEARCH (grep -w WARDEN_ELASTICSEARCH ./.env | cut -d "=" -f2)

                if [ -n "$TRAEFIK_SUBDOMAIN" ]
                  set FULL_DOMAIN "$TRAEFIK_SUBDOMAIN.$TRAEFIK_DOMAIN"
                else
                  set FULL_DOMAIN "$TRAEFIK_DOMAIN"
                end

                set URL_FRONT "$HTTP_PROTOCOL://$FULL_DOMAIN/"
                set URL_ADMIN "$HTTP_PROTOCOL://$FULL_DOMAIN/$ADMIN_PATH/"

                if [ (string length $URL_ADMIN) -gt (string length $ADMIN_PASS) ]
                  set C2_LEN (string length "$URL_ADMIN")
                else
                  set C2_LEN (string length "$ADMIN_PASS")
                end

                if [ $PRINT_MORE_VERBOSE_URLS -eq 1 ]
                  set WARDEN_URL_DOMAIN ".warden.test"
                  set RABBITMQ_URL "$HTTP_PROTOCOL://rabbitmq.$TRAEFIK_DOMAIN/"
                  set ELASTICSEARCH_URL "$HTTP_PROTOCOL://elasticsearch.$TRAEFIK_DOMAIN/"
                  set TRAEFIK_URL "$HTTP_PROTOCOL://traefik$WARDEN_URL_DOMAIN/"
                  set PORTAINER_URL "$HTTP_PROTOCOL://portainer$WARDEN_URL_DOMAIN/"
                  set DNSMASQ_URL "$HTTP_PROTOCOL://dnsmasq$WARDEN_URL_DOMAIN/"
                  set MAILHOG_URL "$HTTP_PROTOCOL://mailhog$WARDEN_URL_DOMAIN/"

                  if [ $WARDEN_ELASTICSEARCH -eq 1 ]
                    set LONGEST_STRING_FOR_C1 Elasticsearch
                  else
                    set LONGEST_STRING_FOR_C1 Portainer
                  end

                  if [ (string length $C2_LEN) -lt (string length $ELASTICSEARCH_URL) ]
                    set C2_LEN (string length "$ELASTICSEARCH_URL")
                  end
                end

                set C1_LEN (string length $LONGEST_STRING_FOR_C1)

                printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                printf "+ %-*s + %-*s + \n" $C1_LEN FrontURL $C2_LEN "$URL_FRONT"
                printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                printf "+ %-*s + %-*s + \n" $C1_LEN AdminURL $C2_LEN "$URL_ADMIN"
                printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL

                if [ $PRINT_MORE_VERBOSE_URLS -eq 1 ]
                  if [ $PRINT_ADMIN_INFO -eq 1 ]
                    printf "+ %-*s + %-*s + \n" $C1_LEN Username $C2_LEN "$ADMIN_USER"
                    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                    printf "+ %-*s + %-*s + \n" $C1_LEN Password $C2_LEN "$ADMIN_PASS"
                    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                  end

                  if [ $WARDEN_RABBITMQ -eq 1 ]
                    printf "+ %-*s + %-*s + \n" $C1_LEN RabbitMQ $C2_LEN "$RABBITMQ_URL"
                    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                  end

                  if [ $WARDEN_ELASTICSEARCH -eq 1 ]
                    printf "+ %-*s + %-*s + \n" $C1_LEN Elasticsearch $C2_LEN "$ELASTICSEARCH_URL"
                    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                  end

                  printf "+ %-*s + %-*s + \n" $C1_LEN Traefik $C2_LEN "$TRAEFIK_URL"
                  printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                  printf "+ %-*s + %-*s + \n" $C1_LEN Portainer $C2_LEN "$PORTAINER_URL"
                  printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                  printf "+ %-*s + %-*s + \n" $C1_LEN Dnsmasq $C2_LEN "$DNSMASQ_URL"
                  printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                  printf "+ %-*s + %-*s + \n" $C1_LEN MailHog $C2_LEN "$MAILHOG_URL"
                  printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
                end
              end
            '';
          };
        };
      };
    })

    (mkIf (cfg.enable && cfgBash.enable) {
      programs.bash = {
        bashrcExtra = ''
          function wardenstart () {
            warden svc up
            warden env up
            get_warden_services_urls
          }

          function wardendown () {
            warden svc down

            if [ "$#" -gt 0 ]; then
              warden env down "$@"
            else
              warden env down
            fi
          }

          function get_warden_services_urls {
            if test -e ./.env; then
                echo ""
                echo "==> [$(date +%H:%M:%S)] Started warden"
                echo ""
                FILL=$(printf '%128s' | tr ' ' '-')
                LONGEST_STRING_FOR_C1="AdminURL"
                PRINT_MORE_VERBOSE_URLS=1
                PRINT_ADMIN_INFO=0
                HTTP_PROTOCOL=https
                ADMIN_PATH=admin
                ADMIN_USER=admin
                ADMIN_PASS=Test1234
                TRAEFIK_DOMAIN=$(grep -w TRAEFIK_DOMAIN ./.env | cut -d "=" -f2)
                TRAEFIK_SUBDOMAIN=$(grep -w TRAEFIK_SUBDOMAIN ./.env | cut -d "=" -f2)
                WARDEN_RABBITMQ=$(grep -w WARDEN_RABBITMQ ./.env | cut -d "=" -f2)
                WARDEN_ELASTICSEARCH=$(grep -w WARDEN_ELASTICSEARCH ./.env | cut -d "=" -f2)

                if test -n "$TRAEFIK_SUBDOMAIN"; then
                    FULL_DOMAIN="$TRAEFIK_SUBDOMAIN.$TRAEFIK_DOMAIN"
                else
                    FULL_DOMAIN="$TRAEFIK_DOMAIN"
                fi

                URL_FRONT="$HTTP_PROTOCOL://$FULL_DOMAIN/"
                URL_ADMIN="$HTTP_PROTOCOL://$FULL_DOMAIN/$ADMIN_PATH/"

                # Calculate length of URL_ADMIN
                C2_LEN=$(expr length "$URL_ADMIN")
                ADMIN_PASS_LEN=$(expr length "$ADMIN_PASS")

                if test $C2_LEN -gt $ADMIN_PASS_LEN; then
                    C2_LEN=$C2_LEN
                else
                    C2_LEN=$ADMIN_PASS_LEN
                fi

                if test $PRINT_MORE_VERBOSE_URLS -eq 1; then
                    WARDEN_URL_DOMAIN=".warden.test"
                    RABBITMQ_URL="$HTTP_PROTOCOL://rabbitmq.$TRAEFIK_DOMAIN/"
                    ELASTICSEARCH_URL="$HTTP_PROTOCOL://elasticsearch.$TRAEFIK_DOMAIN/"
                    TRAEFIK_URL="$HTTP_PROTOCOL://traefik$WARDEN_URL_DOMAIN/"
                    PORTAINER_URL="$HTTP_PROTOCOL://portainer$WARDEN_URL_DOMAIN/"
                    DNSMASQ_URL="$HTTP_PROTOCOL://dnsmasq$WARDEN_URL_DOMAIN/"
                    MAILHOG_URL="$HTTP_PROTOCOL://mailhog$WARDEN_URL_DOMAIN/"

                    if test $WARDEN_ELASTICSEARCH -eq 1; then
                        LONGEST_STRING_FOR_C1="Elasticsearch"
                    else
                        LONGEST_STRING_FOR_C1="Portainer"
                    fi

                    ELASTICSEARCH_URL_LEN=$(expr length "$ELASTICSEARCH_URL")

                    if test $C2_LEN -lt $ELASTICSEARCH_URL_LEN; then
                        C2_LEN=$ELASTICSEARCH_URL_LEN
                    fi
                fi

                C1_LEN=$(expr length "$LONGEST_STRING_FOR_C1")

                printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                printf "+ %-*s + %-*s + \n" $((C1_LEN)) "FrontURL" $((C2_LEN)) "$URL_FRONT"
                printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                printf "+ %-*s + %-*s + \n" $((C1_LEN)) "AdminURL" $((C2_LEN)) "$URL_ADMIN"
                printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"

                if test $PRINT_MORE_VERBOSE_URLS -eq 1; then
                    if test $PRINT_ADMIN_INFO -eq 1; then
                        printf "+ %-*s + %-*s + \n" $((C1_LEN)) "Username" $((C2_LEN)) "$ADMIN_USER"
                        printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                        printf "+ %-*s + %-*s + \n" $((C1_LEN)) "Password" $((C2_LEN)) "$ADMIN_PASS"
                        printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                    fi

                    if test $WARDEN_RABBITMQ -eq 1; then
                        printf "+ %-*s + %-*s + \n" $((C1_LEN)) "RabbitMQ" $((C2_LEN)) "$RABBITMQ_URL"
                        printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                    fi

                    if test $WARDEN_ELASTICSEARCH -eq 1; then
                        printf "+ %-*s + %-*s + \n" $((C1_LEN)) "Elasticsearch" $((C2_LEN)) "$ELASTICSEARCH_URL"
                        printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                    fi

                    printf "+ %-*s + %-*s + \n" $((C1_LEN)) "Traefik" $((C2_LEN)) "$TRAEFIK_URL"
                    printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                    printf "+ %-*s + %-*s + \n" $((C1_LEN)) "Portainer" $((C2_LEN)) "$PORTAINER_URL"
                    printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                    printf "+ %-*s + %-*s + \n" $((C1_LEN)) "Dnsmasq" $((C2_LEN)) "$DNSMASQ_URL"
                    printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                    printf "+ %-*s + %-*s + \n" $((C1_LEN)) "MailHog" $((C2_LEN)) "$MAILHOG_URL"
                    printf "+ %*.*s + %*.*s + \n" 0 $((C1_LEN)) "$FILL" 0 $((C2_LEN)) "$FILL"
                fi
            fi
          }
        '';
      };
    })
  ];
}
