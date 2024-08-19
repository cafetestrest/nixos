{ config, ... }:

{
  imports =
    [
      ./aliases.nix
      ./fish.nix
      ./bash.nix
  ];
}
