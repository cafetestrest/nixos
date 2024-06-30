let
  username = "bajic";
in
{
  user = "${username}";
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
  wardenSha256Hash = "sha256-A5jBH5VY2KhYVyJ5gCAXZpMX0au/W/cRK8AhFXyyu/M="; #nix-shell -p nix-prefetch-git jq --run "nix hash to-sri sha256:\$(nix-prefetch-git --url https://github.com/wardenenv/warden --quiet --rev refs/heads/main | jq -r '.sha256')"
  cursorSize = 24;
  cursorTheme = "macOS-Monterey";
  gtkTheme = "Orchis-Dark";
  gtkIconTheme = "Adwaita";
  gtkFontName = "Cantarell 11";
  fishOmfPecoPluginSha256Hash = "sha256-EUoicPd+aUMlfCeo9BOuIiBlQSpPtMtMn5AUkZU3uQA=";
  fishOmfVcsPluginSha256Hash = "sha256-BVQgQOnPcqIf4eqLrmuUCvZahyEDKzBgJUeppLQWjQY=";
  fishOmfThemeDefaultSha256Hash = "sha256-FVZhJo6BTz5Gt7RSOnXXU0Btxejg/p89AhZOvB9Xk1k=";
  yeelightShellScriptsGitRev = "d8b463dea258b4f1fdf4277dd5b37ca8bebad3ee";
}
