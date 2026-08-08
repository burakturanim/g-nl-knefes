import React, { useState } from 'react';
import { Bell, Volume2, Smartphone, Download, Info, Check, Shield } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Trigger Notification Permission
  const handleRequestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setNotificationMsg('Cihazınız web bildirimlerini desteklemiyor.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationMsg('Bildirim izni verildi! Hatırlatıcılar aktif.');
        onUpdateSettings({ remindersEnabled: true });
        new Notification('Nefes', {
          body: 'Günlük nefes hatırlatıcıların aktifleşti.',
          icon: '/icon-192.svg'
        });
      } else {
        setNotificationMsg('Bildirim izni reddedildi.');
        onUpdateSettings({ remindersEnabled: false });
      }
    } catch {
      setNotificationMsg('Bildirim izni istendi.');
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto max-w-md mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-normal text-[#2A2725] font-['Outfit'] tracking-tight">
          Ayarlar
        </h2>
        <p className="text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] mt-1">
          Hatırlatıcılar, ses ve uygulama tercihlerini yönet.
        </p>
      </div>

      {/* 1. Hatırlatıcılar Bölümü */}
      <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD0]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#5A7863]" />
            <div>
              <h3 className="text-sm font-medium text-[#2A2725] font-['Plus_Jakarta_Sans']">
                Günlük Hatırlatıcılar
              </h3>
              <p className="text-[11px] text-[#7A736B]">Nefes vakitlerinde bildirim al</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.remindersEnabled}
              onChange={(e) => {
                if (e.target.checked) {
                  handleRequestNotificationPermission();
                } else {
                  onUpdateSettings({ remindersEnabled: false });
                }
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#D5C9BB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D5C9BB] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A7863]"></div>
          </label>
        </div>

        {/* Reminder Times */}
        <div className="mt-3 space-y-2.5 text-xs text-[#524C45] font-['Plus_Jakarta_Sans']">
          {/* Sabah */}
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-1.5">☀️ Sabah Hatırlatıcısı</span>
            <input
              type="time"
              value={settings.morningTime}
              onChange={(e) => onUpdateSettings({ morningTime: e.target.value })}
              className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-lg px-2 py-1 text-xs text-[#2A2725] font-medium"
            />
          </div>

          {/* Öğle */}
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-1.5">🌤️ Öğle Hatırlatıcısı</span>
            <input
              type="time"
              value={settings.middayTime}
              onChange={(e) => onUpdateSettings({ middayTime: e.target.value })}
              className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-lg px-2 py-1 text-xs text-[#2A2725] font-medium"
            />
          </div>

          {/* Akşam */}
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-1.5">🌙 Akşam Hatırlatıcısı</span>
            <input
              type="time"
              value={settings.eveningTime}
              onChange={(e) => onUpdateSettings({ eveningTime: e.target.value })}
              className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-lg px-2 py-1 text-xs text-[#2A2725] font-medium"
            />
          </div>
        </div>

        {notificationMsg && (
          <div className="mt-3 p-2 bg-[#EAE3D8] rounded-lg text-[11px] text-[#524C45] text-center font-medium">
            {notificationMsg}
          </div>
        )}
      </div>

      {/* 2. Ses ve Titreşim */}
      <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-4 mb-4 space-y-3">
        <h3 className="text-xs font-semibold text-[#8A725D] uppercase tracking-wider font-['Outfit']">
          Ses & Titreşim
        </h3>

        {/* Sesli Rehber */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-[#8A725D]" />
            <div>
              <div className="text-xs font-medium text-[#2A2725] font-['Plus_Jakarta_Sans']">
                Sesli Yönlendirme Tonal Sesi
              </div>
              <div className="text-[10px] text-[#7A736B]">Faz değişimlerinde yumuşak zil sesi</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#D5C9BB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D5C9BB] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A7863]"></div>
          </label>
        </div>

        {/* Titreşim */}
        <div className="flex items-center justify-between py-1 border-t border-[#E5DDD0] pt-2.5">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-[#8A725D]" />
            <div>
              <div className="text-xs font-medium text-[#2A2725] font-['Plus_Jakarta_Sans']">
                Haptic Titreşim
              </div>
              <div className="text-[10px] text-[#7A736B]">Faz değişiminde hafif titreşim</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hapticEnabled}
              onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#D5C9BB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D5C9BB] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A7863]"></div>
          </label>
        </div>
      </div>

      {/* 3. Ana Ekrana Ekle (PWA Rehberi) */}
      <div className="bg-[#FAF1E8] border border-[#EAC8B0] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#824E2A] font-['Plus_Jakarta_Sans'] mb-2">
          <Download className="w-4 h-4 text-[#C87D53]" />
          <span>Ana Ekrana Ekle (PWA)</span>
        </div>
        <p className="text-xs text-[#6E4226] font-['Plus_Jakarta_Sans'] leading-relaxed mb-2">
          Nefes uygulamasını telefonunda tam ekran uygulama olarak çalıştırmak için Safari veya Chrome menüsünden <span className="font-semibold">“Ana Ekrana Ekle”</span> seçeneğine dokunabilirsin.
        </p>
        <div className="text-[11px] text-[#885A39] space-y-1">
          <div>• <strong>iOS Safari:</strong> Paylaş butonuna dokun → “Ana Ekrana Ekle”</div>
          <div>• <strong>Android Chrome:</strong> Üç noktaya dokun → “Ana ekrana ekle”</div>
        </div>
      </div>

      {/* 4. Gizlilik ve Uygulama Bilgisi */}
      <div className="bg-[#F4EFE6] border border-[#E5DDD0] rounded-2xl p-4 text-xs text-[#7A736B] font-['Plus_Jakarta_Sans'] space-y-2">
        <div className="flex items-center gap-2 font-medium text-[#2A2725]">
          <Shield className="w-4 h-4 text-[#5A7863]" />
          <span>Gizlilik & Veri Saklama</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Tüm nefes verilerin ve ilerlemen doğrudan cihazında güvenle saklanır. Sunuculara hiçbir kişisel veri gönderilmez.
        </p>
        <div className="pt-2 border-t border-[#E5DDD0] flex items-center justify-between text-[11px] text-[#A0988E]">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" /> Nefes Wellness v1.0
          </span>
          <span>Sade & Meditatif</span>
        </div>
      </div>
    </div>
  );
};
