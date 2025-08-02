export const lru = (refString, numFrames) => {
    const steps = [];
    const frames = [];
    const lastUsed = new Map();
    let pageFaults = 0;
    let pageHits = 0;

    for (let i = 0; i < refString.length; i++) {
        const requestedPage = refString[i];
        let result = 'fault';
        let action = '';
        let highlightIndex = -1;

        const frameIndex = frames.indexOf(requestedPage);

        if (frameIndex !== -1) {
            // Page Hit
            pageHits++;
            result = 'hit';
            action = `Page ${requestedPage} is in memory (Hit).`;
            highlightIndex = frameIndex;
            lastUsed.set(requestedPage, i);
        } else {
            // Page Fault
            pageFaults++;
            if (frames.length < numFrames) {
                // Frames are not full, add new page
                frames.push(requestedPage);
                highlightIndex = frames.length - 1;
                action = `Page ${requestedPage} loaded.`;
                lastUsed.set(requestedPage, i);
            } else {
                // Frames are full, evict least recently used page
                let lruPage = frames[0];
                let minTime = lastUsed.get(frames[0]);
                
                for (const page of frames) {
                    if (lastUsed.get(page) < minTime) {
                        minTime = lastUsed.get(page);
                        lruPage = page;
                    }
                }

                const lruIndex = frames.indexOf(lruPage);
                frames[lruIndex] = requestedPage;
                highlightIndex = lruIndex;
                action = `Page ${requestedPage} loaded, Page ${lruPage} evicted.`;
                lastUsed.set(requestedPage, i);
            }
        }

        steps.push({
            step: i + 1,
            requestedPage,
            framesState: [...frames],
            result,
            action,
            pageFaults,
            pageHits,
            highlightIndex,
        });
    }

    return steps;
};
