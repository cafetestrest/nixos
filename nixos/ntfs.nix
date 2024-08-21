{ config, lib, pkgs, ... }:

let
  cfg = config.module.drive.ntfs;
in
{
  options = {
    module.drive.ntfs.enable = mkEnableOption "Enables NTFS partition support";
  };

  config = mkIf cfg.enable {
    #support ntfs hard drive 29-mar-2023
    boot.supportedFilesystems = [ "ntfs" ];
  };
}
