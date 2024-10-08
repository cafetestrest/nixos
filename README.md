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
3. update your username and other variables under:
```bash
nano nixos/hosts/desktop/desktop-modules.nix
```

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

2. update your username and other variables under:
```bash
nano nixos/hosts/desktop/desktop-modules.nix
```

3. install nixos
```bash
sudo nixos-rebuild boot --flake .#$USER
reboot
```

# Post install:
- Wallpaper (https://github.com/ArcticSpaceFox/nixos-artwork/blob/master/wallpapers/nixos-wallpaper-ice-pattern-gradient.svg)

Rotated 180 degrees horizontally and vertically (to get purple to the bottom right)
Upscaled to 3840x2160

Configuration files:

- openweathermap API keys and location data located at: $HOME/.config/scripts/weather.rc
- yrweather API keys and location data located at: $HOME/.config/ags/weather_key
