--[[ =========================================================
     LAST STAND HUD — Standort & Uhrzeit
     ========================================================= ]]
local CARDINALS = { 'N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW' }

local function headingToBearing(h)
    h = ((h or 0) + 22.5) % 360
    if h < 0 then h = h + 360 end
    return CARDINALS[math.floor(h / 45) + 1] or 'N'
end

-- Standort-Update
CreateThread(function()
    while true do
        Wait(Config.LocationUpdateRate)
        local ped    = PlayerPedId()
        local coords = GetEntityCoords(ped)

        local streetHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
        local street     = streetHash ~= 0 and GetStreetNameFromHashKey(streetHash) or ''
        local zone       = GetNameOfZone(coords.x, coords.y, coords.z)
        local area       = zone and GetLabelText(zone) or ''
        if area == 'NULL' or area == nil then area = '' end

        LastStandHUD.send('setLocation', {
            street  = street,
            area    = area,
            bearing = headingToBearing(GetEntityHeading(ped)),
        })
    end
end)

-- Optionale GTA-Spielzeit
if Config.UseGameTime then
    CreateThread(function()
        while true do
            Wait(1000)
            local h, m  = GetClockHours(), GetClockMinutes()
            local d, mo = GetClockDayOfMonth(), GetClockMonth() + 1
            local y     = GetClockYear()
            LastStandHUD.send('setTime', {
                time = string.format('%02d:%02d', h, m),
                date = string.format('%02d.%02d.%04d', d, mo, y),
            })
        end
    end)
end
