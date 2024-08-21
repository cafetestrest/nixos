{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.hardware.amd-gpu;
in
{
  options = {
    module.hardware.amd-gpu.enable = mkEnableOption "Enables AMD GPU and OpenGL";
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

    #OpenGL
    hardware.opengl = {
      enable = true;
      driSupport = true;
      driSupport32Bit = true;
    };

    # hardware.opengl.extraPackages = with pkgs; [
    #   rocm-opencl-icd
    #   rocm-opencl-runtime
    # ];

    # #Vulkan
    # hardware.opengl.driSupport = true;
    # # For 32 bit applications
    # hardware.opengl.driSupport32Bit = true;

    # # For 32 bit applications 
    # hardware.opengl.extraPackages32 = with pkgs; [
    #   driversi686Linux.amdvlk
    # ];
  };
}
