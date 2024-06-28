{ config, pkgs, ... }:

{
  programs = {
    vscode = {
      enable = true;
      package = pkgs.vscodium;

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

    #   userSettings = {
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
    #   };
    };
  };
}
