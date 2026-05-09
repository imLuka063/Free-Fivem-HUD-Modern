--[[ =========================================================
     LAST STAND HUD — NUI Bridge
     Deduplizierungsschicht über SendNUIMessage
     ========================================================= ]]
LastStandHUD = LastStandHUD or {}

LastStandHUD.state = {
    ready      = false,
    master     = true,
    kino       = false,
    elements   = {},
    visibleNow = true,
    focus      = false,
}

local DEDUP = {
    setMoney    = true,
    setId       = true,
    setStatus   = true,
    setHunger   = true,
    setThirst   = true,
    setVoice    = true,
    setJob      = true,
    setTime     = true,
    setLocation = true,
}

local lastPayload = {}

function LastStandHUD.send(action, payload)
    payload = payload or {}
    payload.action = action
    if DEDUP[action] then
        local enc = json.encode(payload)
        if lastPayload[action] == enc then return end
        lastPayload[action] = enc
    end
    SendNUIMessage(payload)
end

function LastStandHUD.invalidate(action)
    if action then lastPayload[action] = nil else lastPayload = {} end
end

function LastStandHUD.setFocus(enabled)
    enabled = not not enabled
    if LastStandHUD.state.focus == enabled then return end
    LastStandHUD.state.focus = enabled
    SetNuiFocus(enabled, enabled)
end

function LastStandHUD.log(...)
    if Config and Config.Debug then
        print('[laststand_hud]', ...)
    end
end
