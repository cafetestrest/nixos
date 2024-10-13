{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.astra-monitor;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.astra-monitor.enable = mkEnableOption "Enables astra-monitor Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.astra-monitor
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/astra-monitor" = {
        gpu-indicators-order = ''["icon","activity bar","activity graph","activity percentage","memory bar","memory graph","memory percentage","memory value"]'';
        headers-height = 0;
        headers-height-override = 0;
        memory-header-percentage = false;
        memory-header-value = true;
        memory-header-value-figures = 2;
        memory-indicators-order = ''["icon","bar","graph","percentage","value","free"]'';
        memory-update = 10.0;
        monitors-order = ''["processor","gpu","memory","storage","network","sensors"]'';
        network-header-bars = false;
        network-header-io = true;
        network-header-show = true;
        network-indicators-order = ''["icon","IO bar","IO graph","IO speed"]'';
        network-update = 10.0;
        processor-header-bars = false;
        processor-header-graph = true;
        processor-header-icon = true;
        processor-header-percentage = true;
        processor-indicators-order = ''["icon","bar","graph","percentage","frequency"]'';
        processor-menu-gpu-color = "";
        processor-update = 10.0;
        profiles = ''{"default":{"panel-margin-left":0,"sensors-header-tooltip-sensor2-digits":-1,"memory-update":10,"gpu-header-memory-graph-color1":"rgba(29,172,214,1.0)","panel-box":"right","memory-header-show":true,"network-header-tooltip-io":true,"processor-header-bars-color2":"rgba(214,29,29,1.0)","processor-header-icon-size":18,"storage-source-storage-io":"auto","sensors-header-tooltip-sensor4-name":"","storage-header-icon-color":"","network-source-public-ipv4":"https://api.ipify.org","storage-header-io-graph-color2":"rgba(214,29,29,1.0)","storage-header-io":false,"processor-menu-top-processes-percentage-core":true,"sensors-header-sensor1":"\\"\\"","processor-header-graph":true,"storage-header-graph-width":30,"network-header-bars":false,"processor-source-load-avg":"auto","network-menu-arrow-color1":"rgba(29,172,214,1.0)","network-source-top-processes":"auto","gpu-header-icon":true,"processor-menu-graph-breakdown":true,"sensors-header-icon-custom":"","sensors-header-sensor2":"\\"\\"","network-header-icon-alert-color":"rgba(235, 64, 52, 1)","memory-header-tooltip-free":false,"storage-header-io-figures":2,"network-menu-arrow-color2":"rgba(214,29,29,1.0)","sensors-header-tooltip-sensor3-name":"","network-source-public-ipv6":"https://api6.ipify.org","monitors-order":"\\"\\"","network-header-graph":true,"network-indicators-order":"\\"\\"","memory-header-percentage":false,"processor-header-tooltip":true,"gpu-main":"\\"\\"","storage-header-bars":true,"sensors-header-tooltip-sensor5-digits":-1,"memory-menu-swap-color":"rgba(29,172,214,1.0)","storage-io-unit":"kB/s","processor-header-graph-color1":"rgba(29,172,214,1.0)","memory-header-graph-width":30,"storage-header-tooltip-value":false,"gpu-header-icon-custom":"","processor-header-graph-breakdown":true,"panel-margin-right":0,"processor-header-frequency":false,"processor-source-cpu-usage":"auto","sensors-header-tooltip-sensor3-digits":-1,"gpu-header-icon-size":18,"memory-header-value-figures":2,"compact-mode":false,"processor-header-frequency-mode":"average","panel-box-order":0,"compact-mode-compact-icon-custom":"","network-header-graph-width":30,"gpu-header-tooltip":true,"sensors-header-icon":true,"gpu-header-activity-percentage-icon-alert-threshold":0,"sensors-header-sensor2-digits":-1,"processor-header-graph-color2":"rgba(214,29,29,1.0)","sensors-header-icon-alert-color":"rgba(235, 64, 52, 1)","sensors-update":10,"gpu-header-tooltip-memory-value":true,"processor-header-bars":false,"gpu-header-tooltip-memory-percentage":true,"gpu-header-memory-bar-color1":"rgba(29,172,214,1.0)","sensors-header-tooltip-sensor1":"\\"\\"","sensors-header-tooltip-sensor1-digits":-1,"storage-header-free-figures":3,"processor-header-percentage-core":false,"sensors-header-tooltip-sensor2-name":"","network-source-network-io":"auto","memory-header-bars":true,"processor-header-percentage":true,"processor-header-frequency-figures":3,"storage-header-io-threshold":0,"memory-header-graph-color1":"rgba(29,172,214,1.0)","compact-mode-activation":"both","storage-header-icon-size":18,"sensors-header-tooltip-sensor1-name":"","sensors-header-icon-size":18,"sensors-header-icon-color":"","explicit-zero":false,"sensors-source":"auto","storage-header-io-graph-color1":"rgba(29,172,214,1.0)","storage-header-percentage-icon-alert-threshold":0,"sensors-header-tooltip-sensor2":"\\"\\"","compact-mode-expanded-icon-custom":"","memory-header-graph-color2":"rgba(29,172,214,0.3)","processor-header-icon-alert-color":"rgba(235, 64, 52, 1)","processor-header-tooltip-percentage":true,"gpu-header-show":false,"network-update":10,"sensors-header-tooltip-sensor3":"\\"\\"","sensors-ignored-attribute-regex":"","memory-header-icon-custom":"","storage-header-tooltip-io":true,"sensors-header-tooltip-sensor4":"\\"\\"","storage-header-percentage":true,"sensors-temperature-unit":"celsius","storage-header-icon-alert-color":"rgba(235, 64, 52, 1)","storage-header-free-icon-alert-threshold":0,"memory-source-top-processes":"auto","storage-header-value-figures":3,"storage-header-io-bars-color1":"rgba(29,172,214,1.0)","storage-menu-arrow-color1":"rgba(29,172,214,1.0)","gpu-header-tooltip-activity-percentage":true,"network-header-icon-custom":"","processor-header-graph-width":30,"network-header-icon":true,"storage-menu-arrow-color2":"rgba(214,29,29,1.0)","sensors-header-sensor2-layout":"vertical","sensors-header-tooltip-sensor5":"\\"\\"","memory-header-bars-breakdown":true,"sensors-header-show":false,"sensors-header-tooltip":false,"storage-header-tooltip":true,"processor-header-bars-core":false,"storage-indicators-order":"\\"\\"","processor-menu-bars-breakdown":true,"storage-header-io-bars-color2":"rgba(214,29,29,1.0)","network-io-unit":"kB/s","storage-header-icon":true,"gpu-header-activity-graph-color1":"rgba(29,172,214,1.0)","memory-unit":"kB-KB","processor-menu-core-bars-breakdown":true,"sensors-header-sensor2-show":false,"network-header-tooltip":true,"storage-header-tooltip-free":true,"storage-header-bars-color1":"rgba(29,172,214,1.0)","theme-style":"dark","storage-source-storage-usage":"auto","network-header-io":true,"storage-main":"[default]","memory-header-tooltip-percentage":true,"memory-indicators-order":"\\"\\"","memory-source-memory-usage":"auto","memory-header-graph-breakdown":false,"memory-header-tooltip-value":true,"memory-menu-graph-breakdown":true,"sensors-indicators-order":"\\"\\"","compact-mode-start-expanded":false,"startup-delay":2,"memory-header-percentage-icon-alert-threshold":0,"sensors-header-sensor1-show":false,"network-ignored-regex":"","storage-update":10,"memory-header-value":true,"memory-header-bars-color1":"rgba(29,172,214,1.0)","network-header-io-graph-color1":"rgba(29,172,214,1.0)","gpu-header-memory-bar":true,"memory-used":"total-free-buffers-cached","gpu-header-memory-graph-width":30,"gpu-header-memory-graph":false,"sensors-ignored-category-regex":"","headers-font-family":"","memory-header-icon":true,"network-header-io-graph-color2":"rgba(214,29,29,1.0)","memory-header-bars-color2":"rgba(29,172,214,0.3)","processor-gpu":true,"network-header-icon-color":"","storage-header-value":false,"gpu-header-icon-alert-color":"rgba(235, 64, 52, 1)","processor-header-icon":true,"headers-font-size":0,"network-header-io-figures":2,"network-header-show":true,"sensors-ignored-regex":"","network-header-io-bars-color1":"rgba(29,172,214,1.0)","processor-update":10,"network-source-wireless":"auto","processor-indicators-order":"[\\"icon\\",\\"bar\\",\\"graph\\",\\"percentage\\",\\"frequency\\"]","storage-header-icon-custom":"","gpu-header-activity-bar":true,"gpu-header-activity-bar-color1":"rgba(29,172,214,1.0)","shell-bar-position":"top","network-ignored":"\\"[]\\"","network-header-io-bars-color2":"rgba(214,29,29,1.0)","memory-header-icon-color":"","sensors-header-sensor1-digits":-1,"storage-header-io-layout":"vertical","memory-header-icon-size":18,"network-header-io-threshold":0,"storage-header-show":true,"sensors-header-tooltip-sensor4-digits":-1,"processor-header-percentage-icon-alert-threshold":0,"memory-header-tooltip":true,"headers-height-override":0,"memory-header-graph":false,"network-header-icon-size":18,"gpu-header-icon-color":"","memory-header-free-figures":3,"storage-header-io-bars":false,"processor-header-bars-breakdown":true,"gpu-header-activity-graph":false,"storage-ignored":"\\"[]\\"","memory-header-icon-alert-color":"rgba(235, 64, 52, 1)","storage-header-free":false,"processor-header-icon-custom":"","gpu-header-memory-percentage":false,"processor-header-tooltip-percentage-core":false,"processor-source-cpu-cores-usage":"auto","processor-source-top-processes":"auto","processor-header-icon-color":"","sensors-header-tooltip-sensor5-name":"","gpu-header-activity-graph-width":30,"gpu-header-activity-percentage":false,"gpu-indicators-order":"\\"\\"","network-header-io-layout":"vertical","gpu-update":1.5,"gpu-header-memory-percentage-icon-alert-threshold":0,"processor-header-bars-color1":"rgba(29,172,214,1.0)","processor-header-show":true,"storage-header-graph":false,"memory-header-free-icon-alert-threshold":0,"storage-ignored-regex":"","storage-menu-device-color":"rgba(29,172,214,1.0)","storage-header-tooltip-percentage":true,"memory-header-free":false,"storage-source-top-processes":"auto"}}'';
        queued-pref-category = "";
        sensors-header-show = false;
        sensors-indicators-order = ''["icon","value"]'';
        sensors-update = 10.0;
        storage-header-percentage = true;
        storage-header-value = false;
        storage-indicators-order = ''["icon","bar","percentage","value","free","IO bar","IO graph","IO speed"]'';
        storage-main = "eui.0025385531b10f69-part5";
        storage-update = 10.0;
      };
    };
  };
}
