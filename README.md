# nixos install of live usb
1. open gparted
  * device / create partition table
  * new / add label (nixos)

2. open terminal
```bash
sudo su
mount /dev/disk/by-label/nixos /mnt
nix-env -iA nixos.git
git clone https://github.com/cafetestrest/nixos.git /mnt/etc/nixos
nixos-install --flake .#<host>
reboot
```
