let
  username = "bajic";
in
{
  user = "${username}";
  username = "${username}";
  homeDirectory = "/home/${username}";
  networkingHostName = "nixos";
  systemArchitecture = "x86_64-linux";
  timezone = "Europe/Belgrade";
  defaultLocale = "en_GB.UTF-8";
  consoleFont = "Lat2-Terminus16";
  initialPassword = "$y$j9T$8zHiYDS6ygvXsdcgXn2pg1$6BkJP/RL33k.q5vUPfXyT0DelCZEt8RbUAcDysQ22A3";
  nixExtraOptions = "experimental-features = nix-command flakes";
  efiSysMountPoint = "/boot/efi";
  grubHardDriveForVM = "/dev/vda";
  configurationLimit = 20;
  wardenSha256Hash = "sha256-CH/pklnxm1nz7miFlRsC7VFQ9n7xDrVYCmqqh0IHA3o="; #nix-shell -p nix-prefetch-git jq --run "nix hash to-sri sha256:\$(nix-prefetch-git --url https://github.com/wardenenv/warden --quiet --rev refs/heads/main | jq -r '.sha256')"
}
