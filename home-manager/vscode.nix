{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.vscode;
  cfgBashrc = config.module.shell.bash.bashrc;
  cfgBash = config.module.shell.bash;
  cfgFish = config.module.shell.fish;
in
{
  options = {
    module.packages.vscode.enable = mkEnableOption "Enables vscode";
  };

  config = mkIf cfg.enable {
    programs = {
      vscode = {
        enable = true;
        enableUpdateCheck = false;
        enableExtensionUpdateCheck = false;
        package =
          (pkgs.vscodium.override
            {
              # isInsiders = true;
              # https://wiki.archlinux.org/title/Wayland#Electron
              commandLineArgs = [
                "--enable-features=UseOzonePlatform"
                # "--ozone-platform-hint=auto"
                "--ozone-platform=wayland"
                # # make it use GTK_IM_MODULE if it runs with Gtk4, so fcitx5 can work with it.
                # # (only supported by chromium/chrome at this time, not electron)
                # "--gtk-version=4"
                # # make it use text-input-v1, which works for kwin 5.27 and weston
                # "--enable-wayland-ime"

                # # fix https://github.com/microsoft/vscode/issues/187436
                # # still not works...
                # "--password-store=gnome" # use gnome-keyring as password store
              ];
            })
          # .overrideAttrs (oldAttrs: rec {
          #   # Use VSCode Insiders to fix crash: https://github.com/NixOS/nixpkgs/issues/246509
          #   src = builtins.fetchTarball {
          #     url = "https://update.code.visualstudio.com/latest/linux-x64/insider";
          #     sha256 = "0k2sh7rb6mrx9d6bkk2744ry4g17d13xpnhcisk4akl4x7dn6a83";
          #   };
          #   version = "latest";
          # })
          ;

        # enableExtensionUpdateCheck = false;
        # enableUpdateCheck = false;
        # mutableExtensionsDir = false;

        extensions = with pkgs.vscode-extensions; [
          jnoortheen.nix-ide
          christian-kohler.path-intellisense
        ];
        # ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
        #   {
        #     name = "mayukaithemevsc";
        #     publisher = "GulajavaMinistudio";
        #     version = "3.2.3";
        #     sha256 = "a0f3c30a3d16e06c31766fbe2c746d80683b6211638b00b0753983a84fbb9dad";
        #   }
        # ];

        userSettings = {
            "update.mode" = "none";
            "update.showReleaseNotes" = false;
            "window.titleBarStyle" = "custom";
      #     "workbench.iconTheme" = "catppuccin-macchiato";
      #     "workbench.colorTheme" = "Mayukai Semantic Mirage";
          
      #     "editor.fontFamily" = "Fira Code";
          
      #     "nix.enableLanguageServer" = true;
      #     "nix.serverPath" = "nil";
      #     "nix.formatterPath" = "nixpkgs-fmt";
      #     "nix.serverSettings" = {
      #       "nil" = {
      #         "formatting" = { "command" = [ "nixpkgs-fmt" ]; };
      #       };
      #     };

      #     "git.enableCommitSigning" = false;
      #     "files.autoSave" = "afterDelay";
      #     "files.autoSaveDelay" = 100;

      #     "powermode.enabled" = false; # stupid
      #     "powermode.combo.location" = "off";
      #     "powermode.combo.counterEnabled" = "hide";
      #     "powermode.shake.enabled" = false;
      #     "powermode.explosions.frequency" = 1;
      #     "powermode.combo.timerEnable" = "hide";
        };
      };
    };

    programs.bash.bashrcExtra = lib.mkIf (cfgBash.enable && cfgBashrc.enable) ''
      function code () {
        if [ "$#" -gt 0 ]; then
          codium "$@"
        else
          codium .
        fi
      }
    '';

    programs.fish.functions = lib.mkIf cfgFish.enable {
      code = {
        body = ''
          if [ (count $argv) -gt 0 ]
              codium $argv
          else
              codium .
          end
        '';
      };

      "." = {
        body = ''
          if [ (count $argv) -gt 0 ]
              codium $argv
          else
              codium .
          end
        '';
      };
    };
  };
}
