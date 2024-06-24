if status is-interactive
    # Commands to run in interactive sessions can go here (bottom 3 commands are custom by bajic)
    set -g theme_powerline_fonts yes
    set -g theme_nerd_fonts no
    set -g fish_prompt_pwd_dir_length 0
end

#CUSTOM COMMANDS BELOW by bajic
#peco on ctrl + r
function fish_user_key_bindings
  bind \cr 'peco_select_history (commandline -b)'
end

#fastfetch instead of default greeting
function fish_greeting
  fastfetch

  if not pidof copyq > /dev/null
      env QT_QPA_PLATFORM=wayland copyq --start-server &
  end
end

alias neofetch='fastfetch'

#vscode run from console as code path
function code --description 'Visual Studio Code'
  #flatpak run com.visualstudio.code $argv;
    if count $argv > /dev/null
        codium $argv
    else
        codium .
    end
end

function . --description 'Visual Studio Code'
    if count $argv > /dev/null
        codium $argv
    else
        codium .
    end
end

# #phpstorm run from console as code path
# function pstorm --description 'PHPStorm'
#   flatpak run com.jetbrains.PhpStorm $argv; 
# end

# #arch update command that creates btrfs snapshot and runs system update
# function arch-update
#   sudo btrfs-snp / install 10 600
#   yay -Syu
# end

#prune docker
function dockerpruneall --description 'prune all from docker'
  docker system prune -a --volumes
  docker builder prune -a
  docker image prune -a
  docker volume prune
  docker network prune
  docker container prune
end

#warden svc
# function warden_services_urls --description 'prints out warden svc URLs'
#   set http_protocol 'https://'
#   set warden_url_suffix '.warden.test'

#   echo '=== Warden services ==='

#   echo 'Traefik:' $http_protocol'traefik'$warden_url_suffix
#   echo 'Portainer:' $http_protocol'portainer'$warden_url_suffix
#   echo 'Dnsmasq:' $http_protocol'dnsmasq'$warden_url_suffix
#   echo 'MailHog:' $http_protocol'mailhog'$warden_url_suffix
# end

#warden env
# function warden_environment_urls -a traefik_domain --description 'prints out warden env URLs'
#   if test -n "$traefik_domain"
#     set http_protocol 'https://'

#     echo '=== Warden environment ==='

#     echo 'RabbitMQ:' $http_protocol'rabbitmq.'$traefik_domain
#     echo 'Elasticsearch:' $http_protocol'elasticsearch.'$traefik_domain
#   end
# end

function get_etc_hosts_domains_from_url -a url --description 'prints out domains for /etc/hosts'
  if test -n "$url"
    set etc_hosts_prefix '127.0.0.1 ::1'

    echo $etc_hosts_prefix 'rabbitmq.'$url
    echo $etc_hosts_prefix 'elasticsearch.'$url
  end
end

# function open_in_browser --description 'opens warden env url in browser'
#   if test -e ./.env
#     set traefik_domain (grep -w TRAEFIK_DOMAIN ./.env | cut -d "=" -f2)

#     if test -n "$traefik_domain"
#       set traefik_url $traefik_domain

#       set traefik_sub_domain (grep -w TRAEFIK_SUBDOMAIN ./.env | cut -d "=" -f2)

#       if test -n "$traefik_sub_domain"
#         set traefik_url (echo $traefik_sub_domain.$traefik_domain)
#       end

#       echo ""
#       set traefik_url (echo 'https://'$traefik_url)

#       echo 'Website:' $traefik_url
#       echo ""

#       # print out warden env URLs
#       warden_environment_urls $traefik_domain
#       echo ""

#       # print out warden svc URLs
#       warden_services_urls

#       sleep 3
#       xdg-open $traefik_url &>/dev/null
#     end

#   end
# end

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

#aliases for shell
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ......='cd ../../../../..'
alias cls='clear'
alias cl='clear'
# alias www='cd ~/Sites'
# alias storm='pstorm'
# alias phpstorm='pstorm'

#docker aliases
alias dockerprune='dockerpruneall'
alias getetchostsfromurl='get_etc_hosts_domains_from_url $argv'
# alias getwardenoutput='get_warden_services_urls'
# alias printwardenoutput='get_warden_services_urls'

# #aliases for development
alias b='warden shell'
# alias wenv='warden env up'
# alias wsvc='warden svc up'
alias start='wardenstart'
# alias wsvcdown='warden svc down'
# alias wenvdown='warden env down'
alias down='wardendown'

# #aliases for m2 warden
alias app='warden shell -c "$argv"'
# alias php='app php $argv'
alias cg='app rm -rf /var/www/html/generated/code/ /var/www/html/generated/metadata/'
# alias composer='warden shell -c "COMPOSER_MEMORY_LIMIT=-1 composer $argv"'
alias cud='composer update'
alias cu='cud --no-dev'
alias cid='COMPOSER_MEMORY_LIMIT=-1 composer install'
alias ci='cid --no-dev'
alias grunt='warden shell -c "grunt $argv"'
alias gw='grunt watch'
alias node='warden shell -c "node $argv"'
alias yarn='warden shell -c "yarn $argv"'
alias npx='warden shell -c "npx $argv"'
# alias gccomposer='app git checkout composer.lock'
#alias gcconfig='app git checkout app/etc/config.php'
# alias vsb='app varnish-static-ban'
# alias vsba='vsb "\.*"'
# alias vsbc='vsb "\.*\.css"'
# alias vsbh='vsb "\.*\.html"'
# alias vsbj='vsb "\.*\.js"'

alias m2='warden shell -c "php -dmemory_limit=-1 bin/magento $argv"'
alias magento='m2'
alias msu='m2 setup:upgrade'
alias sup='msu'
alias cc='m2 cache:clean $argv'
alias cf='m2 cache:flush'
alias ccc='m2 cache:clean config full_page'
alias ccfe='m2 cache:clean block_html layout full_page'
alias dc='m2 setup:di:compile'
alias scd='m2 setup:static-content:deploy -f --jobs 6'
alias static='scd'
alias scd1='m2 setup:static-content:deploy -f'
alias rebuild='msu && cf'
alias rebuild1='msu && dc && scd1 && cf'
alias rebuild6='msu && dc && scd && cf'
alias rebuildprod='rebuild6'
alias rebuildprod1='rebuild1'
alias rei='m2 indexer:reindex'
alias res='m2 indexer:reset'
alias rebuildfull='msu && dc && scd && res && rei && cf'

#warden path expose that enables warden to run
# set PATH "/opt/warden/bin:$PATH"

#git alias
function gco
    git commit -m "$argv"
end

alias gpl='git pull --all'
alias pull='git pull --all'
alias push='git push'
alias gs='git status'
alias ga='git add'
alias gall='git add .'
alias gr='git reset'
alias grall='git reset .'
alias gd='git diff'
alias gcl='git clone'
alias clone='git clone'
alias gch='git checkout'
alias checkout='git checkout'
alias gchall='git checkout .'
alias checkoutall='git checkout .'

#nixos aliases
alias reb="sudo nixos-rebuild switch --flake $HOME/nixos/#$USER"
alias rebuildnocache="rebuild --option eval-cache false"
alias rebuildcache="rebuildnocache"
alias upgrade="rebuild --upgrade"

#set the default theme to the apps that might not support it in Gnome 43 (nautilus primarly did not support theming somewhy on arch so I try to set some workaroung)
#set GTK_THEME WhiteSur-Dark-alt
# set GTK_THEME Tokyonight-Dark-B
#set GTK_THEME Kripton gnome-control-center
#set GTK_THEME Kripton
# set GTK_THEME Kripton

#sets docker host
# set DOCKER_HOST 127.0.0.1:2375

#testing
# alias testing='open_in_browser'

# direnv hook fish | source
