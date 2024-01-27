#!/usr/bin/env bash

[[ ! ${WARDEN_DIR} ]] && >&2 echo -e "\033[31mThis script is not intended to be run directly!\033[0m" && exit 1

#magento
META_PACKAGE=magento/project-community-edition
META_VERSION=
INSTALL_SAMPLE_DATA=0
USE_TFA=0

#admin
ADMIN_PASS=""
ADMIN_USER=admin
ADMIN_PATH="admin"

#http/https
HTTP_PROTOCOL="https"

#show URL's on install
PRINT_MORE_VERBOSE_ON_INSTALL=1
PRINT_ADMIN_CREDENTIALS=

## if magento store url should be opened on install (2 = xdg-open, 1 = sensible-browser, 0 = off -> $traefik_url &>/dev/null)
OPEN_IN_BROWSER=2

function :: {
  echo
  echo "==> [$(date +%H:%M:%S)] $@"
}

locate_env_file() {
    ## locates .env file (.env file needs to be present)
    if [ ! -f ".env" ]; then
        :: "No .env file found, please run where exampleproject is the project name:"
        echo "warden env-init exampleproject magento2"
        echo ""
        :: "Please also sign certificates using the following command:"
        echo "warden sign-certificate exampleproject.test"
        exit 1
    fi
}

locate_auth_json_file() {
    INIT_ERROR=

    ## locates auth.json file inside project
    if [ ! -f "auth.json" ]; then
        INIT_ERROR=1
    fi

    if [[ ${INIT_ERROR} ]]; then
        if [ ! -f "$HOME/.warden/secrets/auth.json" ]; then
            if [[ ${INIT_ERROR} ]]; then
                :: "No auth.json file found, please create it and fill in your composer credentials."
                exit 1
            fi
        fi

        :: "No auth.json file found in the project, defaulting to the: $HOME/.warden/secrets/auth.json"
        cp $HOME/.warden/secrets/auth.json ./auth.json
        INIT_ERROR=
    fi

}

countdown() {
    local seconds="$1"

    secs=$((seconds * 1))
    while [ $secs -gt 0 ]; do
    echo -ne "$secs\033[0K\r"
    sleep 1
    : $((secs--))
    done
}

stop_running_warden() {
    :: "Stopping already running services using: warden svc down"
    warden svc down

    :: "Stopping already running services using: warden env down"
    warden env down
}

start_warden() {
    :: "Starting services using: warden svc up"
    warden svc up

    if [[ ! -f ~/.warden/ssl/certs/${TRAEFIK_DOMAIN}.crt.pem ]]; then
        warden sign-certificate ${TRAEFIK_DOMAIN}
    fi

    warden env build

    :: "Starting environment using: warden env up"
    warden env up
}

wait_composer() {
    INIT_ERROR=1

    :: "Waiting for composer..."
    countdown 10
    echo "Checking if composer is runnning..."

    COMPOSER=$(warden shell -c "composer -V")

    if [[ ${COMPOSER} == "Composer version"* ]]; then
        INIT_ERROR=
    fi

    COMPOSER1=$(warden shell -c "composer -V")
    if [[ ${INIT_ERROR} && ${COMPOSER1} == "Composer version"* ]]; then
        INIT_ERROR=
    fi

    if [[ ${INIT_ERROR} ]]; then
        :: "Waiting to load composer 2nd time - 10 sec"
        countdown 10
        echo "Checking if composer is runnning 2nd time..."
    fi

    COMPOSER2=$(warden env exec -T php-fpm composer -V)
    if [[ ${INIT_ERROR} && ${COMPOSER2} == "Composer version"* ]]; then
        INIT_ERROR=
    fi

    if [[ ${INIT_ERROR} ]]; then
        :: "Composer could not be loaded"
        exit 1
    fi

    echo "Composer is runnning."
}

wait_database() {
    :: "Waiting for mariadb to start listening for connections..."
    countdown 10
    echo "Connecting to the database..."
    warden shell -c "while ! nc -z db 3306 </dev/null; do sleep 2; done"
    echo "Database connection established."
}

initialize() {
    wait_database
    
    wait_composer

    :: "Initialize project source files using composer create-project and then move them into place"

    warden env exec -T php-fpm rm -rf /tmp/exampleproject/
    warden env exec -T php-fpm composer create-project --repository-url=https://repo.magento.com/ "${META_PACKAGE}" /tmp/create-project "${META_VERSION}"
    warden env exec -T php-fpm rsync -a /tmp/create-project/ /var/www/html/
    warden env exec -T php-fpm rm -rf /tmp/exampleproject/
}

install_magento() {
    :: "Install the application"
    
    INSTALL_FLAGS=""

    ## rabbitmq
    if [[ ${WARDEN_RABBITMQ} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS} --amqp-host=rabbitmq
        --amqp-port=5672
        --amqp-user=guest 
        --amqp-password=guest 
        --consumers-wait-for-messages=0 "
    fi

    ## redis
    if [[ ${WARDEN_REDIS} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS} --session-save=redis
        --session-save-redis-host=redis
        --session-save-redis-port=6379
        --session-save-redis-db=2
        --session-save-redis-max-concurrency=20
        --cache-backend=redis
        --cache-backend-redis-server=redis
        --cache-backend-redis-db=0
        --cache-backend-redis-port=6379
        --page-cache=redis
        --page-cache-redis-server=redis
        --page-cache-redis-db=1
        --page-cache-redis-port=6379 "
    fi

    ## varnish
    if [[ ${WARDEN_VARNISH} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS} --http-cache-hosts=varnish:80 "
    fi

    ## opensearch
    if [[ ${WARDEN_OPENSEARCH} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS} --search-engine=opensearch
        --opensearch-host=opensearch
        --opensearch-port=9200
        --opensearch-index-prefix=magento2
        --opensearch-enable-auth=0
        --opensearch-timeout=15 "
    fi

    ## elasticsearch
    if [[ ${WARDEN_OPENSEARCH} != 1 && ${WARDEN_ELASTICSEARCH} == 1 ]]; then
        DOCKER_RUNNING_ES_VERSION=$(docker ps --filter name=elastic --format '{{.Image}}' | sed 's/wardenenv\/elasticsearch://' | sed 's/\([0-9]\)\.\([0-9]\)/elasticsearch\1/');

        if [[ ${DOCKER_RUNNING_ES_VERSION} != "" ]]; then
            INSTALL_FLAGS="${INSTALL_FLAGS} --search-engine=${DOCKER_RUNNING_ES_VERSION}
            --elasticsearch-host=elasticsearch
            --elasticsearch-port=9200"
        fi
    fi

    INSTALL_FLAGS="${INSTALL_FLAGS} \
        --backend-frontname="${ADMIN_PATH}" \
        --db-host=db \
        --db-name=magento \
        --db-user=magento \
        --db-password=magento"

    warden env exec -- -T php-fpm bin/magento setup:install $(echo ${INSTALL_FLAGS})
}

check_two_factor_auth_and_configure_modules() {
    # Function to compare Magento versions
    compare_versions() {
        version1=$1
        version2=$2

        IFS='.' read -ra v1 <<< "$version1"
        IFS='.' read -ra v2 <<< "$version2"

        for ((i = 0; i < ${#v1[@]}; i++)); do
            if ((10#${v1[i]} < 10#${v2[i]})); then
                return 1
            elif ((10#${v1[i]} > 10#${v2[i]})); then
                return 0
            fi
        done

        return 0
    }

    # Function to check if Magento version is greater than or equal to 2.4.6
    check_magento_version() {
        MAGENTO_VERSION=$(warden env exec -T php-fpm bin/magento --version | awk '{print $3}')

        compare_versions "$MAGENTO_VERSION" "2.4.6"

        if [ $? -eq 0 ]; then
            echo "Magento version is greater than or equal to 2.4.6"

            :: Disabling Two Factor Auth and Admin Adobe Ims Two Factor Auth
            warden env exec -T php-fpm bin/magento module:disable Magento_AdminAdobeImsTwoFactorAuth Magento_TwoFactorAuth
        else
            # echo "Magento version is less than 2.4.6"
            :: Disabling Two Factor Auth
            warden env exec -T php-fpm bin/magento module:disable Magento_TwoFactorAuth
        fi
    }

    ## check if two factor authentication is disabled, so it means that tfa module can be disabled as well
    if [[ ${USE_TFA} == 0 ]]; then
        check_magento_version
    fi
}

configure_application() {
    :: "Configure Application"
    :: "URL: $FULL_DOMAIN"

    warden env exec -T php-fpm bin/magento config:set --lock-env web/unsecure/base_url \
        "https://${FULL_DOMAIN}/"

    warden env exec -T php-fpm bin/magento config:set --lock-env web/secure/base_url \
        "https://${FULL_DOMAIN}/"

    warden env exec -T php-fpm bin/magento config:set --lock-env web/secure/offloader_header X-Forwarded-Proto

    warden env exec -T php-fpm bin/magento config:set --lock-env web/secure/use_in_frontend 1
    warden env exec -T php-fpm bin/magento config:set --lock-env web/secure/use_in_adminhtml 1
    warden env exec -T php-fpm bin/magento config:set --lock-env web/seo/use_rewrites 1

    warden env exec -T php-fpm bin/magento config:set --lock-env system/full_page_cache/caching_application 2
    warden env exec -T php-fpm bin/magento config:set --lock-env system/full_page_cache/ttl 604800

    warden env exec -T php-fpm bin/magento config:set --lock-env catalog/search/enable_eav_indexer 1

    warden env exec -T php-fpm bin/magento config:set --lock-env dev/static/sign 0

    warden env exec -T php-fpm bin/magento deploy:mode:set -s developer

    ## check if two factor authentication is disabled, so it means that tfa module can be disabled as well
    check_two_factor_auth_and_configure_modules

    #sampledata install
    install_sample_data

    warden env exec -T php-fpm bin/magento indexer:reindex
    warden env exec -T php-fpm bin/magento cache:flush
    warden env exec -T php-fpm bin/magento cache:disable block_html full_page
}

create_admin_user() {
    :: "Create an admin user"

    ## check if default admin pass is configured
    if [[ ${ADMIN_PASS} == "" ]]; then
        :: There is no Admin pass defined, using random one
        PRINT_ADMIN_CREDENTIALS=1
        ADMIN_PASS=$(warden env exec -T php-fpm pwgen -n1 16)
    fi

    warden env exec -T php-fpm bin/magento admin:user:create \
     --admin-password="${ADMIN_PASS}" \
     --admin-user="${ADMIN_USER}" \
     --admin-firstname="Local" \
     --admin-lastname="Admin" \
     --admin-email="${ADMIN_USER}@mailinator.com"
}

install_sample_data() {
    if [[ ${INSTALL_SAMPLE_DATA} == 1 ]]; then
        :: "Install Magento Sample Data"

        warden env exec -T php-fpm bin/magento sampledata:deploy
        warden env exec -T php-fpm bin/magento setup:upgrade
    fi
}

retrieve_url_info() {
    FULL_DOMAIN="${TRAEFIK_DOMAIN}"

    ## if there is subdomain, append it before domain so it can work both with and without subdomain
    if [[ ${TRAEFIK_SUBDOMAIN} ]]; then
    FULL_DOMAIN="${TRAEFIK_SUBDOMAIN}.${TRAEFIK_DOMAIN}"
    fi

    URL_FRONT="${HTTP_PROTOCOL}://${FULL_DOMAIN}/"
    URL_ADMIN="${HTTP_PROTOCOL}://${FULL_DOMAIN}/${ADMIN_PATH}/"
}

function print_install_info {
    :: Initialization complete

    echo ""
    FILL=$(printf "%0.s-" {1..128})
    LONGEST_STRING_FOR_C1="AdminURL"
    let "C2_LEN=${#URL_ADMIN}>${#ADMIN_PASS}?${#URL_ADMIN}:${#ADMIN_PASS}"
    let "C2_LEN=${C2_LEN}>${#OTPAUTH_QRI}?${C2_LEN}:${#OTPAUTH_QRI}"

    if [[ ${PRINT_MORE_VERBOSE_ON_INSTALL} == 1 ]]; then
        WARDEN_URL_DOMAIN=".warden.test"
        RABBITMQ_URL="${HTTP_PROTOCOL}://rabbitmq.${TRAEFIK_DOMAIN}/"
        ELASTICSEARCH_URL="${HTTP_PROTOCOL}://elasticsearch.${TRAEFIK_DOMAIN}/"
        TRAEFIK_URL="${HTTP_PROTOCOL}://traefik${WARDEN_URL_DOMAIN}/"
        PORTAINER_URL="${HTTP_PROTOCOL}://portainer${WARDEN_URL_DOMAIN}/"
        DNSMASQ_URL="${HTTP_PROTOCOL}://dnsmasq${WARDEN_URL_DOMAIN}/"
        MAILHOG_URL="${HTTP_PROTOCOL}://mailhog${WARDEN_URL_DOMAIN}/"
        LONGEST_STRING_FOR_C1="Elasticsearch"
        let "C2_LEN=${C2_LEN}>${#ELASTICSEARCH_URL}?${C2_LEN}:${#ELASTICSEARCH_URL}"
    fi

    C1_LEN=${#LONGEST_STRING_FOR_C1}

    ## note: in CentOS bash .* isn't supported (is on Darwin), but *.* is more cross-platform
    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
    printf "+ %-*s + %-*s + \n" $C1_LEN FrontURL $C2_LEN "$URL_FRONT"
    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
    printf "+ %-*s + %-*s + \n" $C1_LEN AdminURL $C2_LEN "$URL_ADMIN"
    printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL

    if [[ ${OTPAUTH_QRI} ]]; then
        printf "+ %-*s + %-*s + \n" $C1_LEN AdminOTP $C2_LEN "$OTPAUTH_QRI"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
    fi

    if [[ ${PRINT_ADMIN_CREDENTIALS} ]]; then
        printf "+ %-*s + %-*s + \n" $C1_LEN Username $C2_LEN "$ADMIN_USER"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
        printf "+ %-*s + %-*s + \n" $C1_LEN Password $C2_LEN "$ADMIN_PASS"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
    fi

    if [[ ${PRINT_MORE_VERBOSE_ON_INSTALL} == 1 ]]; then
        if [[ ${WARDEN_RABBITMQ} == 1 ]]; then
            printf "+ %-*s + %-*s + \n" $C1_LEN RabbitMQ $C2_LEN "$RABBITMQ_URL"
            printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
        fi

        if [[ ${WARDEN_ELASTICSEARCH} == 1 ]]; then
            printf "+ %-*s + %-*s + \n" $C1_LEN Elasticsearch $C2_LEN "$ELASTICSEARCH_URL"
            printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
        fi

        printf "+ %-*s + %-*s + \n" $C1_LEN Traefik $C2_LEN "$TRAEFIK_URL"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
        printf "+ %-*s + %-*s + \n" $C1_LEN Portainer $C2_LEN "$PORTAINER_URL"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
        printf "+ %-*s + %-*s + \n" $C1_LEN Dnsmasq $C2_LEN "$DNSMASQ_URL"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
        printf "+ %-*s + %-*s + \n" $C1_LEN MailHog $C2_LEN "$MAILHOG_URL"
        printf "+ %*.*s + %*.*s + \n" 0 $C1_LEN $FILL 0 $C2_LEN $FILL
    fi
}

## open url in browser, 2 = xdg-open, 1 = sensible-browser, 0 = off $traefik_url &>/dev/null
function open_url_in_browser {
  if [[ ${OPEN_IN_BROWSER} == 2 ]]; then
    :: Opening URL in browser
    xdg-open $URL_FRONT &>/dev/null
  fi

  if [[ ${OPEN_IN_BROWSER} == 1 ]]; then
    :: Opening URL in browser
    sensible-browser $URL_FRONT &>/dev/null
  fi
}

get_magento_web_root_location() {
    MAGENTO_WEB_ROOT=$WARDEN_WEB_ROOT

    if [[ ${WARDEN_WEB_ROOT} == "/" ]]; then
        MAGENTO_WEB_ROOT="."
    fi
}

check_if_project_already_installed() {
    ## check to see if it there is app/code folder in webroot, which would mean that magento has already been installed.
    if [[ -d "${MAGENTO_WEB_ROOT}/app/code" ]]; then
        printf "You already have Magento2 instance installed.\n"
        open_url_in_browser
        exit 1
    fi
}

create_app_code_to_indicate_installed() {
    ## create app/code folder which would indicate that the project has been installed and ready for development
    if [[ ! -d "${MAGENTO_WEB_ROOT}/app/code" ]]; then
        :: Creating app/code folder
        mkdir -p "${MAGENTO_WEB_ROOT}/app/code"
    fi
}

#app starts here:

locate_env_file
locate_auth_json_file

#load default values from .env file
source .env

get_magento_web_root_location
retrieve_url_info


stop_running_warden
start_warden

check_if_project_already_installed

initialize

install_magento
configure_application

create_admin_user

open_url_in_browser

create_app_code_to_indicate_installed
print_install_info

# #checks the first letter of the argument provided to the script
# firstArgLetter="$(echo "$1" | head -c 1)"

# if [ -z $firstArgLetter ]; then
#     monthlyAuto
# else
#     if [[ $firstArgLetter == "d" ]]; then
#         disable
#     elif [[ $firstArgLetter == "e" ]]; then
#         enable
#     elif [[ $firstArgLetter == "t" ]]; then
#         toggle
#     elif [[ $firstArgLetter == "a" ]]; then
#         monthlyAuto
#     else
#         monthlyAuto
#     fi
# fi
