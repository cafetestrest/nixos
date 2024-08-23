{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.hardware.amd-gpu;
in
{
  options = {
    module.hardware.amd-gpu.enable = mkEnableOption "Enables AMD GPU";
  };

  config = mkIf cfg.enable {
    #https://nixos.wiki/wiki/AMD_GPU
    boot.initrd.kernelModules = [ "amdgpu" ];

    #XServer
    services.xserver.videoDrivers = [ "amdgpu" ];

    #HIP (removed due error: "error: 'hip' has been removed in favor of 'rocmPackages.clr'")
    # systemd.tmpfiles.rules = [
    #   "L+    /opt/rocm/hip   -    -    -     -    ${pkgs.hip}"
    # ];
  };
}
