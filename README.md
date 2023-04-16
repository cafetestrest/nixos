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
```
3. Change the variables.nix file

4. Run the following to apply (change host)

```bash
nixos-install --flake .#<host>
reboot
```

# nixos install after normal os installation
1. clone repository locally
```bash
nix-env -iA nixos.git
git clone https://github.com/cafetestrest/nixos.git
cd nixos
```

2. copy installed hardware configuration to the repo folder locally
```bash
cp /etc/nixos/hardware-configuration.nix ~/nixos/hardware-configuration.nix
```

3. update your username and other variables under variables.nix,
configurations under configuration.nix and packages to be installed under packages.nix
```bash
nano variables.nix

nano configuration.nix

nano packages.nix
```

4. install nixos
```bash
sudo nixos-rebuild switch --flake .#<host>
reboot
```

# Post install:
- To get omf installed (https://github.com/NixOS/nixpkgs/issues/212158):

```bash
omf-install
chmod +w -R ~/.local/share/omf
omf install z
omf install peco
omf install vcs
omf install default
omf theme default
```

- To get theme (https://github.com/vinceliuice/Orchis-theme):

```bash
git clone https://github.com/vinceliuice/Orchis-theme.git
cd Orchis-theme
./install.sh -c dark --tweaks compact submenu macos --shell 42 --round 5px -l
```

Might be able to get similar results by editing nix overlay and overriding attributes of the orchis-theme like already commended under: gnome/packages.nix file.

- Wallpaper (https://github.com/ArcticSpaceFox/nixos-artwork/blob/master/wallpapers/nixos-wallpaper-ice-pattern-gradient.svg)

Rotated 180 degrees horizontally and vertically (to get purple to the bottom right)
Upscaled to 3840x2160
