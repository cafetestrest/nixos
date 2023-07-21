{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user;
in
{
  #https://nixos.wiki/wiki/AMD_GPU
  boot.initrd.kernelModules = [ "amdgpu" ];

  #XServer
  services.xserver.videoDrivers = [ "amdgpu" ];

  #HIP
  systemd.tmpfiles.rules = [
    "L+    /opt/rocm/hip   -    -    -     -    ${pkgs.hip}"
  ];

  #OpenCL
  hardware.opengl.extraPackages = with pkgs; [
    rocm-opencl-icd
    rocm-opencl-runtime
  ];

  #Vulkan
  hardware.opengl.driSupport = true;
  # For 32 bit applications
  hardware.opengl.driSupport32Bit = true;

  # For 32 bit applications 
  hardware.opengl.extraPackages32 = with pkgs; [
    driversi686Linux.amdvlk
  ];
}