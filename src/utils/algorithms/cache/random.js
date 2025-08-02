export const random = (refString, cacheSize) => {
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
        } else {
            // Cache Miss
            pageFaults++;
            if (cache.length < cacheSize) {
                // Cache is not full, add new block
                cache.push({ block: requestedBlock });
                highlightIndex = cache.length - 1;
                action = `Block ${requestedBlock} loaded.`;
            } else {
                // Cache is full, evict a random block
                const randomIndex = Math.floor(Math.random() * cacheSize);
                const evictedBlock = cache[randomIndex];
                cache[randomIndex] = { block: requestedBlock };
                highlightIndex = randomIndex;
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
