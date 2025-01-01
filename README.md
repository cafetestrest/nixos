![bar-1](https://github.com/user-attachments/assets/52abf09f-a7c2-4ea9-b01b-574902e9fcd7)
![bar-2](https://github.com/user-attachments/assets/3dc8f9f1-e3a0-41c2-b926-46f3e88078a5)
![bar-3](https://github.com/user-attachments/assets/f8b1845e-6197-48b0-8f4a-42178723c851)
![bar-4](https://github.com/user-attachments/assets/944391b8-8d3a-45a1-9177-b5a616c0f5a7)

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

Configuration files:

- openweathermap API keys and location data located at: $HOME/.config/scripts/weather.rc
