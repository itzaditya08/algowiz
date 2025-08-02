export const nextFit = (memoryState, process, lastAllocationIndex) => {
    const numBlocks = memoryState.length;
    // Search from the last allocation point to the end
    for (let i = lastAllocationIndex; i < numBlocks; i++) {
        const block = memoryState[i];
        if (block.type === 'free' && block.size >= process.size) {
            return {
                newMemoryState: memoryState,
                allocatedIndex: i,
                newNextFitPointer: i
            };
        }
    }
    // Wrap around and search from the beginning
    for (let i = 0; i < lastAllocationIndex; i++) {
        const block = memoryState[i];
        if (block.type === 'free' && block.size >= process.size) {
            return {
                newMemoryState: memoryState,
                allocatedIndex: i,
                newNextFitPointer: i
            };
        }
    }
    return { newMemoryState: memoryState, allocatedIndex: null, newNextFitPointer: lastAllocationIndex };
};