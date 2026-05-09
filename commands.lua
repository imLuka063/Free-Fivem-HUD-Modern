--[[ =========================================================
     LAST STAND HUD — Commands & NUI Callbacks
     ========================================================= ]]

-- Commands
RegisterCommand(Config.EditorCommand or 'hud', function()
    LastStandHUD.setFocus(true)
    LastStandHUD.send('openEditor')
end, false)

RegisterCommand(Config.KinoCommand or 'kino', function()
    LastStandHUD.state.kino = not LastStandHUD.state.kino
    SendNUIMessage({ action = 'setKino', enabled = LastStandHUD.state.kino })
    TriggerServerEvent('lastStandHud:saveState', { kino = LastStandHUD.state.kino })
end, false)

RegisterCommand(Config.MasterCommand or 'togglehud', function()
    LastStandHUD.state.master = not LastStandHUD.state.master
    SendNUIMessage({ action = 'setMaster', enabled = LastStandHUD.state.master })
    TriggerServerEvent('lastStandHud:saveState', { master = LastStandHUD.state.master })
end, false)

-- NUI Callbacks
RegisterNUICallback('editorOpen', function(_, cb)
    cb('ok')
end)

RegisterNUICallback('editorClose', function(_, cb)
    LastStandHUD.setFocus(false)
    cb('ok')
end)

RegisterNUICallback('saveLayout', function(data, cb)
    local layout = (type(data) == 'table' and type(data.layout) == 'table') and data.layout or {}
    TriggerServerEvent('lastStandHud:saveLayout', layout)
    cb('ok')
end)

RegisterNUICallback('resetLayout', function(_, cb)
    TriggerServerEvent('lastStandHud:resetLayout')
    cb('ok')
end)

RegisterNUICallback('toggleElement', function(data, cb)
    if type(data) == 'table' and data.id then
        LastStandHUD.state.elements[data.id] = not not data.enabled
        TriggerServerEvent('lastStandHud:saveElements', LastStandHUD.state.elements)
    end
    cb('ok')
end)

RegisterNUICallback('toggleKino', function(data, cb)
    LastStandHUD.state.kino = not not (data and data.enabled)
    TriggerServerEvent('lastStandHud:saveState', { kino = LastStandHUD.state.kino })
    cb('ok')
end)

RegisterNUICallback('toggleMaster', function(data, cb)
    LastStandHUD.state.master = not not (data and data.enabled)
    TriggerServerEvent('lastStandHud:saveState', { master = LastStandHUD.state.master })
    cb('ok')
end)

RegisterNUICallback('progressCancel', function(_, cb)
    TriggerEvent('lastStandHud:progressCancelled')
    cb('ok')
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        LastStandHUD.setFocus(false)
    end
end)
