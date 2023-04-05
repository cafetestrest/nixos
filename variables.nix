{
  user = "bajic";
  username = "bajic";
  homeDirectory = "/home/bajic";
  networkingHostName = "nixos";
  systemArchitecture = "x86_64-linux";
  nixpkgsURL = "github:nixos/nixpkgs/nixos-22.11";
  timezone = "Europe/Belgrade";
  defaultLocale = "en_US.UTF-8";
  consoleFont = "Lat2-Terminus16";
  initialPassword = "123456";
  nixExtraOptions = "experimental-features = nix-command flakes";
  efiSysMountPoint = "/boot/efi";
  grubHardDriveForVM = "/dev/vda";
  configurationLimit = "20";
}
