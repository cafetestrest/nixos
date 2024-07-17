{ pkgs, ... }:

{
  #support ntfs hard drive 29-mar-2023
  boot.supportedFilesystems = [ "ntfs" ];
}
