{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    fish
    peco                      #for oh-my-fish (along with omf plugin)
    # oh-my-fish          #fish extensions (plugins: z, peco, vcs) (themes: default)
  ];

  users.defaultUserShell = pkgs.fish;

  programs.fish = {
    enable = true;
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

      #peco on ctrl + r
      function fish_user_key_bindings
        bind \cr 'peco_select_history (commandline -b)'
      end

      #fastfetch instead of default greeting
      function fish_greeting
        if test -d $HOME/nixos
          cd $HOME/nixos
          fastfetch
        end
      end

      function dockerpruneall --description 'prune all from docker'
        docker system prune -a --volumes
        docker builder prune -a
        docker image prune -a
        docker volume prune
        docker network prune
        docker container prune
      end

      function . --description 'Visual Studio Code'
        if count $argv > /dev/null
            codium $argv
        else
            codium .
        end
      end

      function code --description 'Visual Studio Code'
        if count $argv > /dev/null
            codium $argv
        else
            codium .
        end
      end

      #git alias
      function gco
          git commit -m "$argv"
      end

      function get_warden_services_urls --description 'Prints warden services URLs'
        if test -e ./.env
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

          if test -n "$TRAEFIK_SUBDOMAIN"
            set FULL_DOMAIN "$TRAEFIK_SUBDOMAIN.$TRAEFIK_DOMAIN"
          else
            set FULL_DOMAIN "$TRAEFIK_DOMAIN"
          end

          set URL_FRONT "$HTTP_PROTOCOL://$FULL_DOMAIN/"
          set URL_ADMIN "$HTTP_PROTOCOL://$FULL_DOMAIN/$ADMIN_PATH/"
          
          if test (string length $URL_ADMIN) -gt (string length $ADMIN_PASS)
            set C2_LEN (string length "$URL_ADMIN")
          else
            set C2_LEN (string length "$ADMIN_PASS")
          end

          if test $PRINT_MORE_VERBOSE_URLS -eq 1
            set WARDEN_URL_DOMAIN ".warden.test"
            set RABBITMQ_URL "$HTTP_PROTOCOL://rabbitmq.$TRAEFIK_DOMAIN/"
            set ELASTICSEARCH_URL "$HTTP_PROTOCOL://elasticsearch.$TRAEFIK_DOMAIN/"
            set TRAEFIK_URL "$HTTP_PROTOCOL://traefik$WARDEN_URL_DOMAIN/"
            set PORTAINER_URL "$HTTP_PROTOCOL://portainer$WARDEN_URL_DOMAIN/"
            set DNSMASQ_URL "$HTTP_PROTOCOL://dnsmasq$WARDEN_URL_DOMAIN/"
            set MAILHOG_URL "$HTTP_PROTOCOL://mailhog$WARDEN_URL_DOMAIN/"

            if test $WARDEN_ELASTICSEARCH -eq 1
              set LONGEST_STRING_FOR_C1 Elasticsearch
            else
              set LONGEST_STRING_FOR_C1 Portainer
            end

            if test (string length $C2_LEN) -lt (string length $ELASTICSEARCH_URL)
              set C2_LEN (string length "$ELASTICSEARCH_URL")
            end
          end

          set C1_LEN (string length $LONGEST_STRING_FOR_C1)

          printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
          printf "+ %-*s + %-*s + \n" $C1_LEN FrontURL $C2_LEN "$URL_FRONT"
          printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
          printf "+ %-*s + %-*s + \n" $C1_LEN AdminURL $C2_LEN "$URL_ADMIN"
          printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL

          if test $PRINT_MORE_VERBOSE_URLS -eq 1
            if test $PRINT_ADMIN_INFO -eq 1
              printf "+ %-*s + %-*s + \n" $C1_LEN Username $C2_LEN "$ADMIN_USER"
              printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
              printf "+ %-*s + %-*s + \n" $C1_LEN Password $C2_LEN "$ADMIN_PASS"
              printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
            end

            if test $WARDEN_RABBITMQ -eq 1
              printf "+ %-*s + %-*s + \n" $C1_LEN RabbitMQ $C2_LEN "$RABBITMQ_URL"
              printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
            end

            if test $WARDEN_ELASTICSEARCH -eq 1
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
      end

      function dockerkill --description 'Stops and removed all running docker containers'
        docker stop (docker ps -a -q)
        docker rm (docker ps -a -q)
      end

      function wardenstart --description 'Starts all warden environments and services in folder, prints out urls'
        warden svc up
        warden env up
        get_warden_services_urls
      end

      function wardendown -a arg --description 'Puts down all warden environments and services in folder'
        warden svc down
        if test -n "$arg"
          warden env down $arg
        else
          warden env down
        end
      end

      function create -a arg --description 'Creates file along with all directories specified before it'
        mkdir -p (dirname "$arg")
        touch "$arg"
      end

      function xkill -a arg --description 'Kills specified program'
        if test -n "$arg"
          kill -9 (ps ax | grep arg | awk '{print $1}')
        else
          echo "Please add an argument which process name you would like to kill."
        end
      end

      #set the default theme to the apps that might not support it in Gnome 43 (nautilus primarly did not support theming somewhy on arch so I try to set some workaroung)
      #set GTK_THEME WhiteSur-Dark-alt
      # set GTK_THEME Tokyonight-Dark-B
      #set GTK_THEME Kripton gnome-control-center
      #set GTK_THEME Kripton
      # set GTK_THEME Kripton

      #sets docker host
      # set DOCKER_HOST 127.0.0.1:2375
    '';
    # plugins = with pkgs; [
    #   {
    #     name = "bobthefisher";
    #     src = fishPlugins.bobthefisher.src;
    #   }
    #   {
    #     name = "fzf-fish";
    #     src = fishPlugins.fzf-fish.src;
    #   }
    #   {
    #     name = "z";
    #     src = fishPlugins.z.src;
    #   }
    #   {
    #     name = "forgit";
    #     src = fishPlugins.forgit.src;
    #   }
    #   {
    #     name = "puffer";
    #     src = fishPlugins.puffer.src;
    #   }
    # ];
    # shellAliases = {
    #   garbage = "nix-collect-garbage -d && nix store optimise && sudo nix-collect-garbage -d && sudo nix store optimise";
    #   neofetch = "fastfetch";
    #   code = "codium $argv";
    #   #aliases for shell
    #   ".." = "cd ..";
    #   "..." = "cd ../..";
    #   "...." = "cd ../../..";
    #   "....." = "cd ../../../..";
    #   "......" = "cd ../../../../..";
    #   cls = "clear";
    #   cl = "clear";
    #   # www = "cd ~/Sites";
    #   # storm = "pstorm";
    #   # phpstorm = "pstorm";

    #   #docker aliases
    #   dockerprune = "dockerpruneall";
    #   getetchostsfromurl = "get_etc_hosts_domains_from_url $argv";
    #   # getwardenoutput = "get_warden_services_urls";
    #   # printwardenoutput = "get_warden_services_urls";

    #   # #aliases for development
    #   b = "warden shell";
    #   # wenv = "warden env up";
    #   # wsvc = "warden svc up";
    #   start = "wardenstart";
    #   # wsvcdown = "warden svc down";
    #   # wenvdown = "warden env down";
    #   down = "wardendown";

    #   # #aliases for m2 warden
    #   app = ''warden shell -c "$argv"'';
    #   # php = "app php $argv";
    #   cg = "app rm -rf /var/www/html/generated/code/ /var/www/html/generated/metadata/";
    #   # composer = ''warden shell -c "COMPOSER_MEMORY_LIMIT=-1 composer $argv"'';
    #   cud = "composer update";
    #   cu = "cud --no-dev";
    #   cid = "COMPOSER_MEMORY_LIMIT=-1 composer install";
    #   ci = "cid --no-dev";
    #   grunt = ''warden shell -c "grunt $argv"'';
    #   gw = "grunt watch";
    #   node = ''warden shell -c "node $argv"'';
    #   yarn = ''warden shell -c "yarn $argv"'';
    #   npx = ''warden shell -c "npx $argv"'';
    #   # gccomposer = "app git checkout composer.lock";
    #   #gcconfig = "app git checkout app/etc/config.php";
    #   # vsb = "app varnish-static-ban";
    #   # vsba = "vsb "\.*"";
    #   # vsbc = "vsb "\.*\.css"";
    #   # vsbh = "vsb "\.*\.html"";
    #   # vsbj = "vsb "\.*\.js"";

    #   m2 = ''warden shell -c "php -dmemory_limit=-1 bin/magento $argv"'';
    #   magento = "m2";
    #   msu = "m2 setup:upgrade";
    #   sup = "msu";
    #   cc = ''m2 cache:clean $argv'';
    #   cf = "m2 cache:flush";
    #   ccc = "m2 cache:clean config full_page";
    #   ccfe = "m2 cache:clean block_html layout full_page";
    #   dc = "m2 setup:di:compile";
    #   scd = "m2 setup:static-content:deploy -f --jobs 6";
    #   static = "scd";
    #   scd1 = "m2 setup:static-content:deploy -f";
    #   rebuild = "msu && cf";
    #   rebuild1 = "msu && dc && scd1 && cf";
    #   rebuild6 = "msu && dc && scd && cf";
    #   rebuildprod = "rebuild6";
    #   rebuildprod1 = "rebuild1";
    #   rei = "m2 indexer:reindex";
    #   res = "m2 indexer:reset";
    #   rebuildfull = "msu && dc && scd && res && rei && cf";

    #   #git alias
    #   gpl = "git pull --all";
    #   pull = "git pull --all";
    #   push = "git push";
    #   gs = "git status";
    #   ga = "git add";
    #   gall = "git add .";
    #   gr = "git reset";
    #   grall = "git reset .";
    #   gd = "git diff";
    #   gcl = "git clone";
    #   clone = "git clone";
    #   gch = "git checkout";
    #   checkout = "git checkout";
    #   gchall = "git checkout .";
    #   checkoutall = "git checkout .";

    #   #testing
    #   # testing = "open_in_browser";

    #   #nixos aliases
    #   reb = "sudo nixos-rebuild switch --flake $HOME/nixos/#$USER";
    #   rebuildnocache = "rebuild --option eval-cache false";
    #   rebuildcache = "rebuildnocache";
    #   upgrade = "rebuild --upgrade";
    # };
  };
}

# omf list                                                                                                                                                                                                      18:28:28
# Plugins
# fish-spec	omf		peco		vcs		z

# Themes
# default

# # Installed omf like so:
# sudo chmod +w -R ~/.local/share/omf
# omf-install
# omf theme default
# omf install peco
# omf install z
# omf install vcs
