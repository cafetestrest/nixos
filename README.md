# nixos install of live usb
1. open gparted
  * device / create partition table
  * new / add label (nixos)

2. open terminal
```bash
sudo su
mount /dev/disk/by-label/nixos /mnt
nix-shell -p git
git clone https://github.com/cafetestrest/nixos.git /mnt/etc/nixos
```
3. Change the variables inside flake.nix file.

4. Run the following to apply (change host)

```bash
nixos-install --flake .#<host>
reboot
```

# nixos install after normal os installation
1. clone repository locally
```bash
nix-shell -p git
git clone https://github.com/cafetestrest/nixos.git
cd nixos
```

2. copy installed hardware configuration to the repo folder locally
```bash
cp /etc/nixos/hardware-configuration.nix ~/nixos/hosts/desktop/hardware-configuration.nix
```

3. update your username and other variables under flakes.nix, configurations and packages:
```bash
nano ~/nixos/flakes.nix
```

4. install nixos
```bash
sudo nixos-rebuild switch --flake .#<host>
reboot
```

# Post install:
- Wallpaper (https://github.com/ArcticSpaceFox/nixos-artwork/blob/master/wallpapers/nixos-wallpaper-ice-pattern-gradient.svg)

Rotated 180 degrees horizontally and vertically (to get purple to the bottom right)
Upscaled to 3840x2160


- To resolve the issue with command not found - pasting sql:
sudo nix-channel --update
