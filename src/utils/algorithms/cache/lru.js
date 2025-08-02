export const lru = (refString, cacheSize) => {
    const steps = [];
    let cache = [];
    let pageFaults = 0;
    let pageHits = 0;

    for (let i = 0; i < refString.length; i++) {
        const requestedBlock = refString[i];
        let result = 'miss';
        let action = '';
        let highlightIndex = -1;

        const cacheIndex = cache.findIndex(item => item.block === requestedBlock);

        if (cacheIndex !== -1) {
            // Cache Hit
            pageHits++;
            result = 'hit';
            action = `Block ${requestedBlock} is in cache (Hit).`;
            highlightIndex = cacheIndex;
            // Update last used time
            cache[cacheIndex].lastUsed = i;
        } else {
            // Cache Miss
            pageFaults++;
            if (cache.length < cacheSize) {
                // Cache is not full, add new block
                cache.push({ block: requestedBlock, lastUsed: i });
                highlightIndex = cache.length - 1;
                action = `Block ${requestedBlock} loaded.`;
            } else {
                // Cache is full, evict least recently used block
                let lruBlock = cache[0];
                let minTime = cache[0].lastUsed;
                let lruIndex = 0;

                for (let j = 1; j < cache.length; j++) {
                    if (cache[j].lastUsed < minTime) {
                        minTime = cache[j].lastUsed;
                        lruBlock = cache[j];
                        lruIndex = j;
                    }
                }

                cache[lruIndex] = { block: requestedBlock, lastUsed: i };
                highlightIndex = lruIndex;
                action = `Block ${requestedBlock} loaded, Block ${lruBlock.block} evicted.`;
            }
        }

        steps.push({
            step: i + 1,
            requestedBlock,
            cacheState: [...cache],
            result,
            action,
            totalHits: pageHits,
            totalMisses: pageFaults,
            highlightIndex,
        });
    }

    return steps;
};
