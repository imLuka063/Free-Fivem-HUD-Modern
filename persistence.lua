--[[ =========================================================
     LAST STAND HUD — Persistenz (KVP)
     Speichert Layout, Toggles, Master, Kino pro Spieler
     ========================================================= ]]
HUDStore = {}

local PREFIX = 'ls_hud_'

local function identifier(src)
    local id = GetPlayerIdentifierByType(tostring(src), 'license')
    if id then return id end
    for i = 0, GetNumPlayerIdentifiers(tostring(src)) - 1 do
        local ident = GetPlayerIdentifier(tostring(src), i)
        if ident and ident ~= '' then return ident end
    end
    return nil
end

function HUDStore.load(src)
    local id = identifier(src); if not id then return {} end
    local raw = GetResourceKvpString(PREFIX .. id)
    if not raw or raw == '' then return {} end
    local ok, data = pcall(json.decode, raw)
    return (ok and type(data) == 'table') and data or {}
end

function HUDStore.save(src, data)
    local id = identifier(src); if not id then return end
    data = data or {}
    SetResourceKvp(PREFIX .. id, json.encode(data))
end

function HUDStore.patch(src, patch)
    if type(patch) ~= 'table' then return end
    local data = HUDStore.load(src)
    for k, v in pairs(patch) do data[k] = v end
    HUDStore.save(src, data)
    return data
end

function HUDStore.clear(src)
    local id = identifier(src); if not id then return end
    DeleteResourceKvp(PREFIX .. id)
end
