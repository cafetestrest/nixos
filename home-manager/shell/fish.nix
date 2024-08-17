{ config, pkgs, ... }:

{
  imports =
  [
    ./omf/plugins.nix
  ];

  home.packages = with pkgs; [
    peco  #bash/fish better reverse search
  ];

  programs.fish = {
    enable = true;

    shellAliases = {
      nix-shell = "nix-shell --run fish";
    };

    shellInit = ''
      set -g theme_powerline_fonts yes
      set -g theme_nerd_fonts no
      set -g fish_prompt_pwd_dir_length 0

      #sets fish colors to default
      set -U fish_color_normal normal
      set -U fish_color_command 005fd7 purple
      set -U fish_color_param 00afff cyan
      set -U fish_color_redirection normal
      set -U fish_color_comment red
      set -U fish_color_error red --bold
      set -U fish_color_escape cyan
      set -U fish_color_operator cyan
      set -U fish_color_quote brown
      set -U fish_color_autosuggestion 555 yellow
      set -U fish_color_valid_path --underline
      set -U fish_color_cwd green
      set -U fish_color_cwd_root red
      set -U fish_color_match cyan
      set -U fish_color_search_match --background=purple
      set -U fish_pager_color_prefix cyan
      set -U fish_pager_color_completion normal
      set -U fish_pager_color_description 555 yellow
      set -U fish_pager_color_progress cyan
      set -U fish_color_history_current cyan

      # enables direnv
      # direnv hook fish | source
    '';

    interactiveShellInit = ''
      bind \cr 'peco_select_history (commandline -b)'
    '';

    functions = {
      fish_greeting = {
        body = ''
          if [ -d $HOME/nixos ]
            cd $HOME/nixos
          end
          fastfetch
        '';
        onEvent = "fish_greeting";
      };

      cx = {
        body = ''
          if [ (count $argv) -gt 0 ]
              cd $argv
              l
          else
              l
          end
        '';
      };

      code = {
        body = ''
          if [ (count $argv) -gt 0 ]
              codium $argv
          else
              codium .
          end
        '';
      };

      "." = {
        body = ''
          if [ (count $argv) -gt 0 ]
              codium $argv
          else
              codium .
          end
        '';
      };

      create = {
        body = ''
          mkdir -p (dirname "$arg")
          touch "$arg"
        '';
      };

      # xkill = {
      #   body = ''
      #     if [ (count $argv) -gt 0 ]
      #       kill -9 (ps ax | grep arg | awk '{print $1}')
      #     else
      #       echo "Please add an argument which process name you would like to kill."
      #     end
      #   '';
      # };

      gco = {
        body = ''
          git commit -m "$argv"
        '';
      };

      dockerpruneall = {
        body = ''
          docker system prune -a --volumes
          docker builder prune -a
          docker image prune -a
          docker volume prune
          docker network prune
          docker container prune
          echo "Removed all unused containers, networks, images, volumes and builder cache"
        '';
      };

      dockerkill = {
        body = ''
          docker stop (docker ps -a -q)
          echo "Stopping all running containers"
          docker rm (docker ps -a -q)
          echo "Removed all stopped containers"
        '';
      };

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
}
