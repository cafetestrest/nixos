{ config, lib, ... }:

with lib;

let
  cfg = config.module.gnome.autostart.xpad;
in
{
  options = {
    module.gnome.autostart.xpad.enable = mkEnableOption "Enables xpad on start";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/autostart/xpad.desktop".text = ''
        [Desktop Entry]
        Version=1.0

        Name=Xpad
        Name[af]=Xpad
        Name[bg]=Xpad
        Name[cs]=Xpad
        Name[da]=Xpad
        Name[de]=Xpad
        Name[en_GB]=Xpad
        Name[es]=Xpad
        Name[et]=Xpad
        Name[fi]=Xpad
        Name[fr]=Xpad
        Name[ga]=Xpad
        Name[hr]=Xpad
        Name[hu]=Xpad
        Name[it]=Xpad
        Name[ja]=Xpad
        Name[ko]=Xpad
        Name[lv]=Xpad
        Name[nl]=Xpad
        Name[pt]=Xpad
        Name[ro]=Xpad
        Name[ru]=Xpad
        Name[sv]=Xpad
        Name[th]=Xpad
        Name[tr]=Xpad
        Name[vi]=Xpad
        Name[zh_CN]=Xpad
        Name[zh_TW]=Xpad
        GenericName=Sticky Notes
        GenericName[af]=Plaknotas (klewerig)
        GenericName[bg]=Лепкави бележки
        GenericName[cs]=Lepící poznámky
        GenericName[da]=Selvklæbende noter
        GenericName[de]=Klebezettel
        GenericName[en_GB]=Sticky Notes
        GenericName[es]=Notas adhesivas
        GenericName[et]=Märkmepaberid
        GenericName[fi]=Liimalappumuistiinpanot
        GenericName[fr]=Notes adhésives
        GenericName[ga]=Nótaí Greamaitheacha
        GenericName[hr]=Post-it papirići
        GenericName[hu]=Ragadós jegyzetek
        GenericName[it]=Foglietti adesivi
        GenericName[ja]=付箋
        GenericName[ko]=Sticky Notes
        GenericName[lv]=Līmlapiņas
        GenericName[nl]=Memo's
        GenericName[pt]=Notas colantes
        GenericName[ro]=Note Lipicioase(sticky)
        GenericName[ru]=Cтикеры
        GenericName[sv]=Klistriga anteckningar
        GenericName[vi]=Ghi chép bám dính
        GenericName[zh_CN]=自粘性备注
        GenericName[zh_TW]=自粘性便條
        Comment=Jot down notes for later
        Comment[af]=Maak notas vir later
        Comment[bg]=Запазване на бележките за по-късно
        Comment[cs]=Odsunout níže na později
        Comment[da]=Krads noter ned til senere brug
        Comment[de]=Notizen für später notieren
        Comment[en_GB]=Jot down notes for later
        Comment[es]=Anotar para más tarde
        Comment[et]=Kiirete märkmete tegemine edaspidiseks
        Comment[fi]=Raapusta muistiin myöhempää käyttöä varten
        Comment[fr]=Prendre des notes pour plus tard
        Comment[ga]=Breac nótaí le léamh ar ball
        Comment[hr]=Zapiši bilješku za poslije
        Comment[hu]=Jegyzetek felvitele későbbi használatra
        Comment[it]=Prendi delle note da ricordare
        Comment[ja]=手早くメモを取る
        Comment[nl]=Notities maken voor later
        Comment[pt]=Anotar para mais tarde
        Comment[ro]=Notiţe pentru mai târziu
        Comment[ru]=Заметки/стикеры на вашем рабочем столе
        Comment[sv]=Plita ner anteckningar för senare användning
        Comment[vi]=Ghi nhanh chú thích đến sau
        Comment[zh_CN]=简要记录备注以备日后使用
        Comment[zh_TW]=大略記下備註以供之後使用

        TryExec=xpad
        Exec=xpad
        Terminal=false
        Icon=xpad

        StartupNotify=true
        StartupWMClass=xpad

        Type=Application
        Categories=GTK;Utility;
        X-LXQt-Need-Tray=true
        Keywords=notes;postit
      '';
    };
  };
}
