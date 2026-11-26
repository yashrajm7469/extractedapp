const si = require('systeminformation');
const storage = require('electron-json-storage-sync');
const { contextBridge } = require('electron');
const { disableCache } = require('../../env-variables'); 

if (disableCache) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key == "current_user") {
            localStorage.removeItem(key);
        }
    });
}

si.baseboard()
    .then((data) => {
        const motherboardId = data.serial;
        contextBridge.exposeInMainWorld('get_guuid', motherboardId);
        //console.log(motherboardId);
    })
    .catch((error) => {
        //console.error(error);
        contextBridge.exposeInMainWorld('get_guuid', error);
    });

async function get_key(key) {
    let data = await storage.get(key);
    return data;
}

async function set_key(key, value) {
    return await storage.set(key, value);
}

async function remove_key(key) {
    return await storage.remove(key);
}

contextBridge.exposeInMainWorld('get_key', async (key) => {
    try {
        return await get_key(key);
    } catch (error) {
        console.error('Error retrieving key:', error);
    }
});

contextBridge.exposeInMainWorld('set_key', async (key, value) => {
    try {
        return await set_key(key,value);
    } catch (error) {
        console.error('Error retrieving key:', error);
    }
});

contextBridge.exposeInMainWorld('remove_key', async (key) => {
    try {
        return await remove_key(key);
    } catch (error) {
        console.error('Error retrieving key:', error);
    }
});
