export const worstFit = (memoryState, process) => {
    let worstFitIndex = -1;
    let maxSize = -1;

    for (let i = 0; i < memoryState.length; i++) {
        const block = memoryState[i];
        if (block.type === 'free' && block.size >= process.size) {
            if (block.size > maxSize) {
                maxSize = block.size;
                worstFitIndex = i;
            }
        }
    }

    return { newMemoryState: memoryState, allocatedIndex: worstFitIndex, startIndex: worstFitIndex };
};