auth_token_src="$HOME/.warden/.authtoken"
auth_token=""
network_name=""
nginx_name=""

function get_auth_token() {
    if [ -f "$auth_token_src" ]; then
        auth_token=$(cat "$auth_token_src");
    fi

    if [ ! "$auth_token" ]; then
        echo "No authtoken file found: $HOME/.warden/.authtoken or empty file contents.";
        exit 1
    fi
}

function get_network_name() {
    network_name=$(docker network ls --filter name="$1" --format '{{.Name}}');
}

function get_network_name_auto() {
    network_name=$(docker network ls --filter name=default --format '{{.Name}}' | grep -v "magento_default" | head -n 1);
}

function get_nginx_name_auto() {
    nginx_name=$(docker ps --filter name=nginx --format '{{.Names}}')
}

function get_nginx_name() {
    nginx_name=$(docker ps --filter name="$1"-nginx --format '{{.Names}}');
}

function run_docker () {
    if [ ! "$nginx_name" ]; then
        echo "No nginx name found when running 'docker ps' command.";
        exit 1
    fi

    if [ ! "$network_name" ]; then
        echo "No network name found when running 'docker network ls' command.";
        exit 1
    fi

    echo "network_name:$network_name, nginx_name:$nginx_name";

    docker run --rm -it -p 4040:4040 --link "$nginx_name" --net "$network_name" wernight/ngrok ngrok http "$nginx_name":80 --authtoken "$auth_token"

    # https://github.com/orgs/wardenenv/discussions/563 #ngrok + xdebug
}

function warden_ngrok () {
    get_auth_token
    get_network_name "$1"
    get_nginx_name "$1"
}

function warden_ngrok_auto () {
    get_auth_token
    get_network_name_auto
    get_nginx_name_auto
}

# Example: "myapp" is WARDEN_ENV_NAME from .env
if [ ! "$1" ]; then
    warden_ngrok_auto
else
    warden_ngrok "$1"
fi

run_docker
