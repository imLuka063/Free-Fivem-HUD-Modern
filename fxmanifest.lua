fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'LAST STAND'
description 'LAST STAND HUD — ESX backend with Crimson NUI frontend'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/css/*.css',
    'html/js/*.js',
    'html/files/*.png',
}

shared_scripts {
    '@es_extended/imports.lua',
    'config.lua',
}

client_scripts {
    'client/nui.lua',
    'client/main.lua',
    'client/location.lua',
    'client/voice.lua',
    'client/commands.lua',
    'client/exports.lua',
}

server_scripts {
    'server/persistence.lua',
    'server/main.lua',
    'server/exports.lua',
}

dependency 'es_extended'
