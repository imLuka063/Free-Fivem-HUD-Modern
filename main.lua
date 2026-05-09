--[[ =========================================================
     LAST STAND HUD — Server Main
     ESX Integration, State-Sync, Admin-Broadcasts
     ========================================================= ]]
ESX = exports['es_extended']:getSharedObject()

local function isAdmin(src)
    if src == 0 then return true end
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return false end
    local group = xPlayer.getGroup and xPlayer.getGroup() or 'user'
    return Config.AdminGroups[group] == true
end

-- State-Sync Events
RegisterNetEvent('lastStandHud:requestState', function()
    local src = source
    local data = HUDStore.load(src)
    TriggerClientEvent('lastStandHud:loadState', src, data)
end)

RegisterNetEvent('lastStandHud:saveLayout', function(layout)
    if type(layout) ~= 'table' then return end
    HUDStore.patch(source, { layout = layout })
end)

RegisterNetEvent('lastStandHud:resetLayout', function()
    HUDStore.patch(source, { layout = {} })
end)

RegisterNetEvent('lastStandHud:saveElements', function(elements)
    if type(elements) ~= 'table' then return end
    local clean = {}
    for k, v in pairs(elements) do
        if type(k) == 'string' then clean[k] = not not v end
    end
    HUDStore.patch(source, { elements = clean })
end)

RegisterNetEvent('lastStandHud:saveState', function(patch)
    if type(patch) ~= 'table' then return end
    local clean = {}
    if patch.master ~= nil then clean.master = not not patch.master end
    if patch.kino   ~= nil then clean.kino   = not not patch.kino end
    if next(clean) then HUDStore.patch(source, clean) end
end)

-- State beim Login laden
AddEventHandler('esx:playerLoaded', function(playerId)
    SetTimeout(2500, function()
        if GetPlayerName(playerId) == nil then return end
        local data = HUDStore.load(playerId)
        TriggerClientEvent('lastStandHud:loadState', playerId, data)
    end)
end)

-- Admin Commands
RegisterCommand('announce', function(src, args)
    if not isAdmin(src) then return end
    local message = table.concat(args, ' ')
    if message == '' then return end
    TriggerClientEvent('lastStandHud:announce', -1, {
        title    = 'Ankündigung',
        message  = message,
        icon     = '!',
        duration = 10000,
    })
end, true)

RegisterCommand('announcehide', function(src)
    if not isAdmin(src) then return end
    TriggerClientEvent('lastStandHud:announceHide', -1)
end, true)

RegisterCommand('notifyall', function(src, args)
    if not isAdmin(src) then return end
    local message = table.concat(args, ' ')
    if message == '' then return end
    TriggerClientEvent('lastStandHud:notify', -1, {
        type    = 'info',
        title   = 'Server',
        message = message,
    })
end, true)

RegisterCommand('hudnotify', function(src, args)
    if not isAdmin(src) then return end
    local target = tonumber(args[1])
    local ntype  = args[2] or 'info'
    table.remove(args, 1); table.remove(args, 1)
    local message = table.concat(args, ' ')
    if not target or message == '' then return end
    TriggerClientEvent('lastStandHud:notify', target, {
        type    = ntype,
        title   = 'Admin',
        message = message,
    })
end, true)

-- Reset HUD layout storage for current player
RegisterCommand('resetmyhud', function(src)
    if src == 0 then
        print('[HUD] Cannot reset HUD from console')
        return
    end
    HUDStore.clear(src)
    TriggerClientEvent('lastStandHud:notify', src, {
        type    = 'success',
        title   = 'HUD Reset',
        message = 'Your HUD layout has been reset to default!',
    })
    print('[HUD] Reset HUD layout for player ' .. src)
end, false)
