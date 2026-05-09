--[[ =========================================================
     LAST STAND HUD — Configuration
     ========================================================= ]]
Config = Config or {}

-- Allgemein
Config.Debug               = false
Config.StartVisible        = true

-- Update-Intervalle (ms)
Config.UpdateRate          = 500     -- Status / Geld / Job / ID
Config.LocationUpdateRate  = 1500    -- Straße / Zone / Blickrichtung
Config.VisibilityCheckRate = 500     -- Tod / Pausemenü Auto-Hide

-- ESX Status (Hunger / Durst)
Config.UseESXStatus        = true

-- Voice-Integration (pma-voice kompatibel)
Config.VoiceKey            = 'N'
Config.VoiceTiers          = {
    { label = 'Flüstern', range = 3.0  },
    { label = 'Normal',   range = 8.0  },
    { label = 'Schreien',  range = 15.0 },
}
Config.DefaultVoiceTier    = 2    -- 1-basierter Index

-- Commands
Config.EditorCommand       = 'hud'         -- HUD-Editor öffnen
Config.KinoCommand         = 'kino'        -- Kino-Modus an/aus
Config.MasterCommand       = 'togglehud'   -- Komplettes HUD an/aus

-- Auto-Hide Verhalten
Config.AutoHideOnDeath     = true
Config.AutoHideOnPauseMenu = true

-- Admin-Gruppen für Ankündigungen
Config.AdminGroups         = { owner = true, dev = true, manager = true, admin = true }

-- GTA-Spielzeit statt Systemzeit verwenden (false = Frontend nutzt OS-Uhr)
Config.UseGameTime         = false
