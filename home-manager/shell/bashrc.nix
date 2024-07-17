{ config, pkgs, ... }:

{
  programs.bash = {
    enableCompletion = true;
    bashrcExtra = ''
      if [ -d "$HOME/nixos" ]; then
        cd "$HOME/nixos"
        fastfetch
      fi

      # devenv
      #eval "$(direnv hook bash)"

      # history
      HISTCONTROL=ignoredups # no duplicate lines in history
      HISTSIZE=200000
      HISTFILESIZE=200000
      # HISTTIMEFORMAT='%Y/%m/%d-%H:%M	'

      # Check the window size after each command and, if necessary, update the values of LINES and COLUMNS.
      shopt -s checkwinsize
      # HIT ENTER FIRST IF LAST COMMAND IS NOT SEEN IN ANOTHER WINDOW
      # http://superuser.com/questions/37576/can-history-files-be-unified-in-bash
      # (`histappend` in `shellOptions` above is also part of this)
      #PROMPT_COMMAND="''\${PROMPT_COMMAND:+$PROMPT_COMMAND$'\n'}history -a; history -c; history -r" # help history
      shopt -s histappend # man shopt

      # . $HOME/.config/scripts/z/z.sh

      # Function to search through history and run the selected command
      peco_select_history() {
          # Get the selected command from history
          local selected_command=$(history | cut -c 8- | peco --query "$READLINE_LINE")

          # If a command was selected, insert it into the current line
          if [ -n "$selected_command" ]; then
              READLINE_LINE="$selected_command"
              READLINE_POINT=$"{#READLINE_LINE}"
          fi
      }

      # Bind the function to a key (Ctrl-R in this example)
      bind -x '"\C-r": peco_select_history'

      function gco () {
        git commit -m "$1"
      }

      function dockerpruneall () {
        docker system prune -a --volumes
        docker builder prune -a
        docker image prune -a
        docker volume prune
        docker network prune
        docker container prune
      }

      function dockerkill () {
        docker stop $(docker ps -a -q)
        docker rm $(docker ps -a -q)
      }

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

      function create () {
        mkdir -p $(dirname $1)
        touch $1
      }

      function code () {
        if [ "$#" -gt 0 ]; then
          code "$@"
        else
          code .
        fi
      }

      function xkill {
          if [[ -n "$1" ]]; then
              kill -9 $(ps ax | grep "$1" | grep -v grep | awk '{print $1}')
          else
              echo "Please add an argument for the process name you would like to kill."
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
}
