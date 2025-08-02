export const optimal = (refString, numFrames) => {
    const steps = [];
    const frames = [];
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
        } else {
            // Page Fault
            pageFaults++;
            if (frames.length < numFrames) {
                // Frames are not full, add new page
                frames.push(requestedPage);
                highlightIndex = frames.length - 1;
                action = `Page ${requestedPage} loaded.`;
            } else {
                // Frames are full, evict page that will not be used for the longest time
                let victimPage = null;
                let maxFutureUse = -1;

                for (const page of frames) {
                    const futureIndex = refString.slice(i + 1).indexOf(page);
                    if (futureIndex === -1) {
                        // This page is never used again, so it's the optimal choice
                        victimPage = page;
                        break;
                    }
                    if (futureIndex > maxFutureUse) {
                        maxFutureUse = futureIndex;
                        victimPage = page;
                    }
                }

                const victimIndex = frames.indexOf(victimPage);
                frames[victimIndex] = requestedPage;
                highlightIndex = victimIndex;
                action = `Page ${requestedPage} loaded, Page ${victimPage} evicted.`;
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
