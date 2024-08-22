{ config, lib, ... }:

with lib;

let
  cfg = config.module.shell.warden;
  cfgFish = config.module.shell.fish;
in
{
  config = mkIf (cfg.enable && cfgFish.enable) {
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
  };
}
