--[[ =========================================================
     LAST STAND HUD — Server Exports
     ========================================================= ]]

exports('Notify', function(target, notifyType, title, message, duration, color)
    if not target then return end
    TriggerClientEvent('lastStandHud:notify', target, {
        type     = notifyType or 'info',
        title    = title,
        message  = message,
        duration = duration,
        color    = color,
    })
end)

exports('NotifyAll', function(notifyType, title, message, duration, color)
    TriggerClientEvent('lastStandHud:notify', -1, {
        type     = notifyType or 'info',
        title    = title,
        message  = message,
        duration = duration,
        color    = color,
    })
end)

exports('ClearNotifications', function(target)
    TriggerClientEvent('lastStandHud:clearNotifications', target or -1)
end)

exports('Announce', function(target, title, message, icon, duration)
    TriggerClientEvent('lastStandHud:announce', target or -1, {
        title    = title,
        message  = message,
        icon     = icon,
        duration = duration,
    })
end)

exports('HideAnnouncement', function(target)
    TriggerClientEvent('lastStandHud:announceHide', target or -1)
end)

exports('ShowHelp', function(target, key, text)
    TriggerClientEvent('lastStandHud:help', target, { key = key, text = text })
end)

exports('HideHelp', function(target)
    TriggerClientEvent('lastStandHud:helpHide', target)
end)

exports('StartProgress', function(target, label, duration, cancelKey, cancellable)
    TriggerClientEvent('lastStandHud:progressStart', target, {
        label       = label,
        duration    = duration,
        cancelKey   = cancelKey,
        cancellable = cancellable,
    })
end)

exports('ResetLayout', function(target)
    HUDStore.clear(target)
    TriggerClientEvent('lastStandHud:loadState', target, {})
end)

exports('LoadState', function(target)
    if not target then return {} end
    return HUDStore.load(target)
end)
