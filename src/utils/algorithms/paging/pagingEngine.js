const createStep = (step, page, frames, faults, hit, highlight, action) => ({
    step, requestedPage: page, frames: [...frames], pageFaults: faults, isHit: hit, highlightIndex: highlight, action
});

export const generatePagingSteps = (refString, capacity, algorithm) => {
    const steps = [];
    let frames = [];
    let faults = 0;
    
    // For FIFO
    let fifoPointer = 0;
    // For LRU
    const lastUsed = new Map();

    for (let i = 0; i < refString.length; i++) {
        const page = refString[i];
        const frameIdx = frames.indexOf(page);
        lastUsed.set(page, i);

        if (frameIdx !== -1) {
            // Hit
            steps.push(createStep(i + 1, page, frames, faults, true, frameIdx, `Page ${page} found in memory (Hit).`));
        } else {
            // Miss
            faults++;
            if (frames.length < capacity) {
                frames.push(page);
                steps.push(createStep(i + 1, page, frames, faults, false, frames.length - 1, `Page Fault! Added ${page} to empty frame.`));
            } else {
                let replaceIdx = -1;
                let evicted = null;

                if (algorithm === 'FIFO') {
                    replaceIdx = fifoPointer;
                    evicted = frames[replaceIdx];
                    fifoPointer = (fifoPointer + 1) % capacity;
                } 
                else if (algorithm === 'LRU') {
                    let lruPage = frames[0];
                    let minIndex = lastUsed.get(lruPage);
                    for (let j = 1; j < frames.length; j++) {
                        if (lastUsed.get(frames[j]) < minIndex) {
                            minIndex = lastUsed.get(frames[j]);
                            lruPage = frames[j];
                        }
                    }
                    replaceIdx = frames.indexOf(lruPage);
                    evicted = lruPage;
                } 
                else if (algorithm === 'Optimal') {
                    let farthest = i;
                    replaceIdx = -1;
                    for (let j = 0; j < frames.length; j++) {
                        const nextUse = refString.indexOf(frames[j], i + 1);
                        if (nextUse === -1) {
                            replaceIdx = j; // Page never used again
                            break;
                        }
                        if (nextUse > farthest) {
                            farthest = nextUse;
                            replaceIdx = j;
                        }
                    }
                    if (replaceIdx === -1) replaceIdx = 0;
                    evicted = frames[replaceIdx];
                }

                frames[replaceIdx] = page;
                steps.push(createStep(i + 1, page, frames, faults, false, replaceIdx, `Page Fault! Evicted ${evicted} and added ${page}.`));
            }
        }
    }
    return steps;
};