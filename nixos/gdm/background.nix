{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.display-manager.gdm.custom-background;
  cfgBackgroundImagePath = config.module.display-manager.gdm.backgroundImagePath;
in
{
  options = {
    module.display-manager.gdm.custom-background.enable = mkEnableOption "Enables GDM Custom Background";
    module.display-manager.gdm.backgroundImagePath = mkOption {
      type = types.str;
      description = "Path to the image used in GDM";
      default = "";
    };
  };

  config = mkIf cfg.enable {
    nixpkgs = {
      overlays = [
        (self: super: {
          gnome-shell = super.gnome-shell.overrideAttrs (old: {
            patches = (old.patches or []) ++ [
              (let
                # bg = pkgs.fetchurl {
                #   url = "https://orig00.deviantart.net/0054/f/2015/129/b/9/reflection_by_yuumei-d8sqdu2.jpg";
                #   sha256 = "0f0vlmdj5wcsn20qg79ir5cmpmz5pysypw6a711dbaz2r9x1c79l";
                # };
              in pkgs.writeText "bg.patch" ''
diff --git a/data/theme/gnome-shell-sass/widgets/_login-lock.scss b/data/theme/gnome-shell-sass/widgets/_login-lock.scss
index 909fa62..d0a8d0e 100644
--- a/data/theme/gnome-shell-sass/widgets/_login-lock.scss
+++ b/data/theme/gnome-shell-sass/widgets/_login-lock.scss
@@ -206,7 +206,10 @@ $_gdm_dialog_width: 25em;
 }

 #lockDialogGroup {
-  background-color: $_gdm_bg;
+  background: url(${cfgBackgroundImagePath});
+  // background-repeat: repeat-x;
+  // background-size: auto;
+  // background-position: 0 0;
 }

 // Clock

              '')
            ];
          });
        })
      ];
    };
  };
}
