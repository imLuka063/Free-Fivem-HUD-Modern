--[[ =========================================================
     LAST STAND HUD — Voice-Bereich (yaca-voice Integration)
     Liest die 4 Reichweiten-Stufen direkt aus yaca-voice aus:
     3m, 5m, 10m, 30m
     ========================================================= ]]

local VOICE_LABELS = {
    ['3']  = 'Flüstern',
    ['5']  = 'Normal',
    ['10'] = 'Laut',
    ['30'] = 'Schreien',
}

local currentRange = 3
local yacaAvailable = false

-- Prüfen ob yaca-voice verfügbar ist
local function checkYaca()
    local ok, result = pcall(function()
        return GetResourceState('yaca-voice') == 'started'
    end)
    return ok and result
end

-- yaca-voice Reichweite auslesen und an HUD senden
local function syncVoice()
    if not yacaAvailable then return end

    local ok, range = pcall(function()
        return exports['yaca-voice']:getVoiceRange()
    end)

    if not ok or not range then return end

    currentRange = tonumber(range) or currentRange
    local tierIdx = 0

    -- Index bestimmen basierend auf Reichweite
    if currentRange == 3  then tierIdx = 0
    elseif currentRange == 5  then tierIdx = 1
    elseif currentRange == 10 then tierIdx = 2
    elseif currentRange == 30 then tierIdx = 3
    end

    local label = VOICE_LABELS[tostring(currentRange)] or tostring(currentRange) .. 'M'

    LastStandHUD.send('setVoice', {
        label = label,
        tier  = tierIdx,
        total = 4,
        meta  = currentRange .. 'M',
    })
end

-- yaca-voice Event: Reichweite geändert
AddEventHandler('yaca:external:voiceRangeUpdate', function(range, rangeIndex)
    currentRange = tonumber(range) or currentRange
    local tierIdx = tonumber(rangeIndex) or 0

    local label = VOICE_LABELS[tostring(currentRange)] or currentRange .. 'M'

    LastStandHUD.send('setVoice', {
        label = label,
        tier  = tierIdx,
        total = 4,
        meta  = currentRange .. 'M',
    })
end)

-- Fallback-Poll für den Fall dass das Event nicht fired
CreateThread(function()
    Wait(2000)
    yacaAvailable = checkYaca()

    if yacaAvailable then
        LastStandHUD.log('yaca-voice erkannt, Voice-Sync aktiv')
        syncVoice()

        -- Regelmäßig pollen als Fallback
        while true do
            Wait(1000)
            syncVoice()
        end
    else
        LastStandHUD.log('yaca-voice nicht gefunden, Voice deaktiviert')
    end
end)

-- Bei Player-Load erneut syncen
RegisterNetEvent('esx:playerLoaded', function()
    SetTimeout(1500, function()
        yacaAvailable = checkYaca()
        if yacaAvailable then syncVoice() end
    end)
end)
