export const compaction = (memoryState, totalMemorySize) => {
    const allocatedBlocks = memoryState.filter(block => block.type === 'allocated');
    let newMemoryState = [];
    let currentAddress = 0;
    let totalAllocatedSize = 0;
    // Shift allocated blocks to the beginning
    allocatedBlocks.forEach(block => {
        newMemoryState.push({ ...block, startAddress: currentAddress });
        currentAddress += block.size;
        totalAllocatedSize += block.size;
    });
    // Create a single free block at the end
    const freeSize = totalMemorySize - totalAllocatedSize;
    if (freeSize > 0) {
        newMemoryState.push({ id: 'free', type: 'free', size: freeSize, startAddress: currentAddress });
    }
    return newMemoryState;
};