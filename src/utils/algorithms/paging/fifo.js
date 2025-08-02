export const fifo = (refString, numFrames) => {
    const steps = [];
    const frames = [];
    let pageFaults = 0;
    let pageHits = 0;
    let framePointer = 0;

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
        } else {
            // Page Fault
            pageFaults++;
            if (frames.length < numFrames) {
                // Frames are not full, add new page
                frames.push(requestedPage);
                highlightIndex = frames.length - 1;
                action = `Page ${requestedPage} loaded.`;
            } else {
                // Frames are full, evict oldest page (FIFO)
                const evictedPage = frames[framePointer];
                frames[framePointer] = requestedPage;
                highlightIndex = framePointer;
                framePointer = (framePointer + 1) % numFrames;
                action = `Page ${requestedPage} loaded, Page ${evictedPage} evicted.`;
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
