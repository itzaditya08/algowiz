export const firstFit = (memoryState, process) => {
    for (let i = 0; i < memoryState.length; i++) {
        const block = memoryState[i];
        if (block.type === 'free' && block.size >= process.size) {
            return { newMemoryState: memoryState, allocatedIndex: i, startIndex: i };
        }
    }
    return { newMemoryState: memoryState, allocatedIndex: null, startIndex: null };
};