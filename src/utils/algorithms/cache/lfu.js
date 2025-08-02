export const lfu = (refString, cacheSize) => {
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
            cache[cacheIndex].frequency++;
        } else {
            // Cache Miss
            pageFaults++;
            if (cache.length < cacheSize) {
                // Cache is not full, add new block
                cache.push({ block: requestedBlock, frequency: 1, lastUsed: i });
                highlightIndex = cache.length - 1;
                action = `Block ${requestedBlock} loaded.`;
            } else {
                // Cache is full, evict least frequently used block
                let lfuBlock = cache[0];
                let minFreq = cache[0].frequency;
                let lfuIndex = 0;

                for (let j = 1; j < cache.length; j++) {
                    if (cache[j].frequency < minFreq) {
                        minFreq = cache[j].frequency;
                        lfuBlock = cache[j];
                        lfuIndex = j;
                    } else if (cache[j].frequency === minFreq && cache[j].lastUsed < lfuBlock.lastUsed) {
                        // Tie-breaking: Use LRU for blocks with the same frequency
                        lfuBlock = cache[j];
                        lfuIndex = j;
                    }
                }

                cache[lfuIndex] = { block: requestedBlock, frequency: 1, lastUsed: i };
                highlightIndex = lfuIndex;
                action = `Block ${requestedBlock} loaded, Block ${lfuBlock.block} evicted.`;
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
