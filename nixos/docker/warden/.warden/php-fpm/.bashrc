# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific environment
if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]
then
    PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
export PATH

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions	  

alias cls='clear'
alias www='cd /var/www/html'

alias cg='rm -rf /var/www/html/generated/code/ /var/www/html/generated/metadata/'
alias cid='COMPOSER_MEMORY_LIMIT=-1 composer install'
alias ci='cid --no-dev'
alias cud='COMPOSER_MEMORY_LIMIT=-1 composer u'
alias cu='cud --no-dev'

alias m2='php -dmemory_limit=-1 /var/www/html/bin/magento'
alias msu="m2 setup:upgrade"
alias dc='m2 setup:di:compile'
alias cc='m2 cache:clean'
alias ccc='m2 cache:clean config full_page'
alias ccfe='m2 cache:clean block_html layout full_page'
alias cf='m2 cache:flush'
