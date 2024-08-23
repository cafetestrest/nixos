{ config, lib, ... }:

with lib;

let
  cfg = config.module.hardware.opengl;
in
{
  options = {
    module.hardware.opengl.enable = mkEnableOption "Enables OpenGL";
  };

  config = mkIf cfg.enable {
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
