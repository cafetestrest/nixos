#!/usr/bin/env bash

[[ ! ${WARDEN_DIR} ]] && >&2 echo -e "\033[31mThis script is not intended to be run directly!\033[0m" && exit 1

function :: {
  echo
  echo "==> [$(date +%H:%M:%S)] $@"
}

check_warden_version() {
    ## verify warden version constraint
    WARDEN_VERSION=$(warden version 2>/dev/null) || true
    WARDEN_REQUIRE=0.6.0

    if [[ "$WARDEN_VERSION" != "in-dev" ]] && ! test $(version ${WARDEN_VERSION}) -ge $(version ${WARDEN_REQUIRE}); then
        error "Warden ${WARDEN_REQUIRE} or greater is required (version ${WARDEN_VERSION} is installed)"
        exit 1
    fi
}

locate_env_file() {
    ## locates .env file (.env file needs to be present)
    if [[ ! -f ".env" ]]; then
        :: "No .env file found, please run where exampleproject is the project name:"
        echo "warden env-init exampleproject magento2"
        echo ""
        :: "Please also sign certificates using the following command:"
        echo "warden sign-certificate exampleproject.test"
        exit 1
    fi

    ## load configuration needed for setup
    WARDEN_ENV_PATH="$(locateEnvPath)" || exit $?
    loadEnvConfig "${WARDEN_ENV_PATH}" || exit $?

    assertDockerRunning
}

no_auth_json_file_prompt_for_creds() {
    # If neither global nor local exists, prompt for creds
    read -p "No existing composer credentials were found.  Would you like to configure them? [y/N] " willManuallyInputCreds
    if [[ "$willManuallyInputCreds" =~ ^([yY][eE][sS]|[yY1])$ ]]; then
        read -p "Public Key: " composerPublicKey
        read -p "Private Key: " composerPrivateKey

        hadToCreateComposerJson=0
        if [[ ! -f "composer.json" ]]; then
            hadToCreateComposerJson=1
            # Temporary workaround for auth requiring composer.json file
            echo "{}" > "composer.json"
        fi
    fi
}

locate_auth_json_file() {
    INIT_ERROR=

    ## locates auth.json file inside project
    if [[ ! -f "${WARDEN_WEB_ROOT}/auth.json" ]]; then
        INIT_ERROR=1
    fi

    if [[ ${INIT_ERROR} ]]; then
        if [ ! -f "$HOME/.warden/secrets/auth.json" ]; then
            no_auth_json_file_prompt_for_creds
        else
            :: "No auth.json file found in the project, defaulting to the: $HOME/.warden/secrets/auth.json"
            cp $HOME/.warden/secrets/auth.json ./auth.json
            INIT_ERROR=
        fi
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
    :: "Stopping already running services using: warden svc down --remove-orphans"
    warden svc down --remove-orphans

    :: "Stopping already running services using: warden env down --remove-orphans"
    warden env down --remove-orphans

    # Check if there are any running Docker containers
    if [ -n "$(docker ps -q)" ]; then
        echo "Stopping all running Docker containers..."
        # Stop all running Docker containers
        docker stop $(docker ps -q)
        echo "All running Docker containers stopped."
    fi
}

start_warden() {
    :: "Starting services using: warden svc up"
    warden svc up

    if [[ ! -f ~/.warden/ssl/certs/${TRAEFIK_DOMAIN}.crt.pem ]]; then
        sudo warden sign-certificate ${TRAEFIK_DOMAIN}
    fi

    warden env build

    :: "Starting environment using: warden env up"
    warden env up
}

check_composer_running() {
    :: "Waiting for composer..."
    countdown 5

    echo "Checking if composer is runnning..."
    COMPOSER=$(warden shell -c "composer -V")

    if [[ ${COMPOSER} == "Composer version"* ]]; then
        INIT_ERROR=
    fi
}

wait_composer() {
    INIT_ERROR=1

    check_composer_running

    if [[ ${INIT_ERROR} ]]; then
        check_composer_running
    fi

    if [[ ${INIT_ERROR} ]]; then
        check_composer_running
    fi

    if [[ ${INIT_ERROR} ]]; then
        check_composer_running
    fi

    if [[ ${INIT_ERROR} ]]; then
        :: "Composer could not be loaded"
        exit 1
    fi

    echo "Composer is runnning."

    if [[ ${hadToCreateComposerJson} == 1 ]]; then
        warden env exec -T php-fpm composer config http-basic.repo.magento.com "$composerPublicKey" "$composerPrivateKey"

        rm ${WARDEN_WEB_ROOT}/composer.json
        :: Credentials Sync to Composer
        countdown 5
    fi
}

check_docker_database_exists() {
    echo "Dry run to the database: ${MYSQL_DATABASE}"
    DB_ID=$(docker ps --filter name=db --format '{{.ID}}')
    docker exec "${DB_ID}" mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" --database="${MYSQL_DATABASE}"
}

create_docker_database() {
    docker exec "${DB_ID}" mysql -u root -p"${MYSQL_PASSWORD}" -e "CREATE DATABASE ${MYSQL_DATABASE}; GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}'; FLUSH PRIVILEGES;"
    :: "Creating database: $MYSQL_DATABASE"
    countdown 5
    check_docker_database_exists
}

wait_database() {
    :: "Waiting for mariadb to start listening for connections..."
    countdown 5
    echo "Connecting to the database..."
    warden shell -c "while ! nc -z db 3306 </dev/null; do sleep 2; done"

    check_docker_database_exists || create_docker_database

    echo "Database connection established."
}

check_db_dump_required_files() {
    eval filepath="$DB_DUMP"

    if [ -e ${filepath} ]; then
        full_path=$(realpath ${filepath})
    else
        echo "File $filepath does NOT exist."
        exit -1
    fi

    if [[ ! -d "${MAGENTO_WEB_ROOT}/app/etc" ]]; then
        :: Creating app/etc folder
        mkdir -p "${MAGENTO_WEB_ROOT}/app/etc"
    fi

    if [ ! -f "${MAGENTO_WEB_ROOT}/app/etc/env.php" ]; then
        echo "No env.php file found, please move existing one under path: ${MAGENTO_WEB_ROOT}/app/etc/env.php."
        exit -1
    fi

    if [ ! -f "${MAGENTO_WEB_ROOT}/composer.json" ]; then
        echo "No composer.json file found, please move existing one under path: ${MAGENTO_WEB_ROOT}/composer.json."
        exit -1
    fi
}

initialize() {
    wait_database
    
    wait_composer

    if [[ ${DB_DUMP} ]]; then
        check_db_dump_required_files

        :: Importing database from: $full_path, could take a bit, please wait.
        if [[ $DB_DUMP == *.gz ]]; then
            cat ${full_path} | gunzip -c | warden db import
        else
            cat ${full_path} | warden db import
        fi
        :: Database import done.
    else
        :: "Initialize project source files using composer create-project and then move them into place"

        if [ "$META_PACKAGE" == "mage-os/project-community-edition" ]; then
            REPO_URL=https://repo.mage-os.org/
        else
            REPO_URL=https://repo.magento.com/
        fi

        warden env exec -T php-fpm rm -rf /tmp/create-project/
        warden env exec -T php-fpm composer create-project --repository-url=$REPO_URL "${META_PACKAGE}" /tmp/create-project "${META_VERSION}"
        warden env exec -T php-fpm rsync -a /tmp/create-project/ /var/www/html/
        warden env exec -T php-fpm rm -rf /tmp/create-project/
    fi
}

install_magento() {
    :: "Install the application"
    
    INSTALL_FLAGS=""

    ## rabbitmq
    if [[ ${WARDEN_RABBITMQ} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS}
        --amqp-host=rabbitmq
        --amqp-port=5672
        --amqp-user=guest 
        --amqp-password=guest 
        --consumers-wait-for-messages=0 "
    fi

    ## redis
    if [[ ${WARDEN_REDIS} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS}
        --session-save=redis
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
        INSTALL_FLAGS="${INSTALL_FLAGS}
        --http-cache-hosts=varnish:80 "
    fi

    ## opensearch
    if [[ ${WARDEN_OPENSEARCH} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS}
        --search-engine=opensearch
        --opensearch-host=opensearch
        --opensearch-port=9200
        --opensearch-index-prefix=magento2
        --opensearch-enable-auth=0
        --opensearch-timeout=15 "
    fi

    ## elasticsearch
    if [[ ${WARDEN_OPENSEARCH} != 1 && ${WARDEN_ELASTICSEARCH} == 1 ]]; then
        INSTALL_FLAGS="${INSTALL_FLAGS}
        --search-engine=${DOCKER_RUNNING_ES_VERSION}
        --elasticsearch-host=elasticsearch
        --elasticsearch-port=9200"
    fi

    if [[ ${MYSQL_USER} == "" ]]; then
        MYSQL_USER="magento"
    fi

    if [[ ${MYSQL_DATABASE} == "" ]]; then
        MYSQL_DATABASE="magento"
    fi

    if [[ ${MYSQL_PASSWORD} == "" ]]; then
        MYSQL_PASSWORD="magento"
    fi

    INSTALL_FLAGS="${INSTALL_FLAGS}
    --backend-frontname="${ADMIN_PATH}"
    --db-host=db
    --db-name="${MYSQL_DATABASE}"
    --db-user="${MYSQL_USER}"
    --db-password="${MYSQL_PASSWORD}""

    echo "Install Flags: $INSTALL_FLAGS"
    warden env exec -- -T php-fpm bin/magento setup:install $(echo ${INSTALL_FLAGS})
}

disable_two_factor_auth() {
    if [[ ${USE_TFA} == 0 ]]; then
        :: Disabling Two Factor Auth modules

        if [[ $(warden env exec -T php-fpm bin/magento module:status | grep Magento_AdminAdobeImsTwoFactorAuth) ]]; then
            :: Disabling module: Magento_AdminAdobeImsTwoFactorAuth
            warden env exec -T php-fpm bin/magento module:disable Magento_AdminAdobeImsTwoFactorAuth
        fi

        if [[ $(warden env exec -T php-fpm bin/magento module:status | grep Magento_TwoFactorAuth) ]]; then
            :: Disabling module: Magento_TwoFactorAuth
            warden env exec -T php-fpm bin/magento module:disable Magento_TwoFactorAuth
        fi
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
    disable_two_factor_auth

    #sampledata install
    install_sample_data

    warden env exec -T php-fpm bin/magento indexer:reindex
    warden env exec -T php-fpm bin/magento cache:flush
    #warden env exec -T php-fpm bin/magento cache:disable block_html full_page
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

verify_warden_has_search() {
    HAS_SEARCH=0

    ## opensearch
    if [[ ${WARDEN_OPENSEARCH} == 1 ]]; then
        HAS_SEARCH=1
    fi

    ## elasticsearch
    if [[ ${WARDEN_OPENSEARCH} != 1 && ${WARDEN_ELASTICSEARCH} == 1 ]]; then
        DOCKER_RUNNING_ES_VERSION=$(docker ps --filter name=elastic --format '{{.Image}}' | grep 'elastic' | cut -d ':' -f 2 | cut -d '.' -f 1);

        if [[ ${DOCKER_RUNNING_ES_VERSION} != "" ]]; then
            DOCKER_RUNNING_ES_VERSION="elasticsearch$DOCKER_RUNNING_ES_VERSION"
            HAS_SEARCH=1
        fi
    fi

    if [[ ${HAS_SEARCH} == 0 ]]; then
        :: "Warden .env file has search missing. Please enable either WARDEN_OPENSEARCH or WARDEN_ELASTICSEARCH."
        #exit 1
    fi
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
        OPENSEARCH_URL="${HTTP_PROTOCOL}://opensearch.${TRAEFIK_DOMAIN}/"
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

        if [[ ${WARDEN_OPENSEARCH} == 1 ]]; then
            printf "+ %-*s + %-*s + \n" $C1_LEN Elasticsearch $C2_LEN "$OPENSEARCH_URL"
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
        print_install_info
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

install_magento_from_db_dump() {
    check_db_dump_required_files

    :: Installing dependencies
    warden env exec -T php-fpm composer install

    :: Configuring application
    countdown 5

    warden env exec -T php-fpm bin/magento module:enable --all
    warden env exec -T php-fpm bin/magento cache:flush -q
    warden env exec -T php-fpm bin/magento app:config:import

    :: bin/magento setup:db-schema:upgrade
    warden env exec -T php-fpm php -d memory_limit=-1 bin/magento setup:db-schema:upgrade

    :: bin/magento setup:db-data:upgrade
    warden env exec -T php-fpm php -d memory_limit=-1 bin/magento setup:db-data:upgrade

    :: bin/magento setup:db-data:upgrade
    warden env exec -T php-fpm php -d memory_limit=-1 bin/magento setup:db-data:upgrade

    #:: Rebuilding Magento
    #warden env exec -T php-fpm bin/magento setup:upgrade
    #warden env exec -T php-fpm bin/magento setup:di:compile
    #warden env exec -T php-fpm bin/magento setup:static-content:deploy -f

    :: Flushing cache
    warden env exec -T php-fpm bin/magento cache:flush
    #warden env exec -T php-fpm bin/magento cache:disable block_html full_page
}

#app starts here:

check_warden_version
locate_env_file
locate_auth_json_file

#load default values from .env file
source .env

get_magento_web_root_location
retrieve_url_info

stop_running_warden
start_warden

check_if_project_already_installed

verify_warden_has_search

initialize

if [[ ${DB_DUMP} ]]; then
    install_magento_from_db_dump
else
    install_magento

    configure_application

    create_admin_user
fi

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
