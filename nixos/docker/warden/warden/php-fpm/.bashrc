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
alias l='ls -alh'
alias www='cd /var/www/html'

alias cg='rm -rf /var/www/html/generated/code/ /var/www/html/generated/metadata/'
alias cid='COMPOSER_MEMORY_LIMIT=-1 composer install'
alias ci='cid --no-dev'
alias cud='COMPOSER_MEMORY_LIMIT=-1 composer u'
alias cu='cud --no-dev'

alias m2='php -dmemory_limit=-1 /var/www/html/bin/magento'
alias msu="m2 setup:upgrade"
alias sup="m2 setup:upgrade"
alias dc='m2 setup:di:compile'
alias cc='m2 cache:clean'
alias ccc='m2 cache:clean config full_page'
alias ccfe='m2 cache:clean block_html layout full_page'
alias cf='m2 cache:flush'
alias static='scd --jobs $(($(nproc) / 2))'
alias static1='m2 setup:static-content:deploy -f'
alias scd1='m2 setup:static-content:deploy -f'
alias scd='static'
alias rei='m2 indexer:reindex'
alias fullrei='m2 indexer:reset && rei && cf'

alias rebuild='msu && cf'
alias rebuildprod='msu && dc && static && cf'

alias gw='grunt watch'

alias m2adminsession='m2 config:set admin/security/session_lifetime 31536000'
alias m2adminenablecashondelivery='m2 config:set payment/cashondelivery/active 1'
alias m2admindisablecashondelivery='m2 config:set payment/cashondelivery/active 0'
alias m2adminenablecheckmo='m2 config:set payment/checkmo/active 1'
alias m2admindisablecheckmo='m2 config:set payment/checkmo/active 0'
alias m2adminpasswordreset='m2 config:set customer/password/min_time_between_password_reset_requests 0 && m2 config:set customer/password/max_number_password_reset_requests 0'
alias m2adminquickstart='m2adminsession && m2adminenablecashondelivery && m2adminpasswordreset && cf'
