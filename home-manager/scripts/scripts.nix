{ config, pkgs, ... }:

{
  imports =
    [
      ./startup.nix
      ./bluetoothbatterypercentage.nix
      ./yrweather.nix
      ./openweathermap.nix
      ./toggleidle.nix
      ./nightlight.nix
      ./note.nix
      ./screenshot.nix
      ./playerstartup.nix
      ./idle.nix
      ./powermenu.nix
      ./wakefromsleep.nix
      ./ngrokwarden.nix
      ./headset.nix
      ./monitor.nix
      ./resetbluetoothags.nix
      ./sys.nix
      ./clipboardtoggle.nix
  ];
}
