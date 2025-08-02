export const bestFit = (memoryState, process) => {
    let bestFitIndex = -1;
    let minSize = Infinity;
    for (let i = 0; i < memoryState.length; i++) {
        const block = memoryState[i];
        if (block.type === 'free' && block.size >= process.size) {
            if (block.size < minSize) {
                minSize = block.size;
                bestFitIndex = i;
            }
        }
    }
    return { newMemoryState: memoryState, allocatedIndex: bestFitIndex, startIndex: bestFitIndex };
};