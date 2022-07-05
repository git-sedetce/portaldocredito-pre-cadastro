
const cache = new Map();

const localCache = function(chave, valor){
    const dbKey = JSON.stringify(chave, Object.keys(chave).sort());
     if (cache.has(dbKey)) {
        return cache.get(dbKey);
    }
    cache.set(dbKey, instance);
    return valor;
}

module.exports = localCache;