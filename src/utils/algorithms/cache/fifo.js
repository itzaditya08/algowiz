export const fifo = (refString, cacheSize) => {
    const steps = [];
    let cache = [];
    let pageFaults = 0;
    let pageHits = 0;
    let framePointer = 0;

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
        } else {
            // Cache Miss
            pageFaults++;
            if (cache.length < cacheSize) {
                // Cache is not full, add new block
                cache.push({ block: requestedBlock, fifoIndex: i });
                highlightIndex = cache.length - 1;
                action = `Block ${requestedBlock} loaded.`;
            } else {
                // Cache is full, evict oldest block (FIFO)
                const evictedBlock = cache[framePointer];
                cache[framePointer] = { block: requestedBlock, fifoIndex: i };
                highlightIndex = framePointer;
                framePointer = (framePointer + 1) % cacheSize;
                action = `Block ${requestedBlock} loaded, Block ${evictedBlock.block} evicted.`;
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
