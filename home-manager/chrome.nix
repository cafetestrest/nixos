{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.chrome;
in
{
  options = {
    module.packages.chrome.enable = mkEnableOption "Enables chromium";
  };

  config = mkIf cfg.enable {
    programs.chromium = {
      enable = true;
      extensions = [
        { id = "eimadpbcbfnmbkopoojfekhnkhdbieeh"; }  # Dark Reader
        { id = "gnphfcibcphlpedmaccolafjonmckcdn"; }  # Extension Switch
        { id = "gphhapmejobijbbhgpjhcjognlahblep"; }  # GNOME Shell integration
        { id = "fihnjjcciajhdojfnbdddfaoknhalnja"; }  # I don't care about cookies
        { id = "mnjggcdmjocbbbhaepdhchncahnbgone"; }  # SponsorBlock for YouTube - Skip Sponsorships
        { id = "cjpalhdlnbpafiamejdnhcphjbkeiagm"; }  # uBlock Origin
        { id = "dbepggeogbaibhgnhhndojpepiihcmeb"; }  # Vimium
        { id = "eadndfjplgieldjbigjakmdgkmoaaaoc"; }  # Xdebug helper
      ];
      commandLineArgs = [
          "--ozone-platform-hint=auto"
          "--ozone-platform=wayland"
          # make it use GTK_IM_MODULE if it runs with Gtk4, so fcitx5 can work with it.
          # (only supported by chromium/chrome at this time, not electron)
          # "--gtk-version=4"
          # make it use text-input-v1, which works for kwin 5.27 and weston
          # "--enable-wayland-ime"
          # enable hardware acceleration - vulkan api
          # "--enable-features=Vulkan"
        "--force-dark-mode"
        "--enable-features=TouchpadOverscrollHistoryNavigation,WebUIDarkMode"
        # "--force-device-scale-factor=${toString config.united.desktop.xorg.scale}"
        "--password-store=basic"
      ];
    };
  };
}
