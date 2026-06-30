export const generateAllocationSteps = (totalMemory, initialBlocks, incomingProcesses, algorithm, performCompaction) => {
    const steps = [];
    // Deep copy state
    let blocks = JSON.parse(JSON.stringify(initialBlocks));
    let nextFitPointer = 0;

    const snap = (msg, activeProc = null) => {
        steps.push({ blocks: JSON.parse(JSON.stringify(blocks)), activeProcess: activeProc, message: msg });
    };

    snap("Memory Initialized. Ready for allocation.");

    for (const proc of incomingProcesses) {
        snap(`Incoming request: Process ${proc.id} requires ${proc.size}KB`, proc);

        let allocatedIdx = -1;

        if (algorithm === 'First Fit') {
            allocatedIdx = blocks.findIndex(b => b.isFree && b.size >= proc.size);
        } else if (algorithm === 'Next Fit') {
            for (let i = 0; i < blocks.length; i++) {
                const idx = (nextFitPointer + i) % blocks.length;
                if (blocks[idx].isFree && blocks[idx].size >= proc.size) {
                    allocatedIdx = idx;
                    nextFitPointer = idx;
                    break;
                }
            }
        } else if (algorithm === 'Best Fit') {
            let minDiff = Infinity;
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].isFree && blocks[i].size >= proc.size && (blocks[i].size - proc.size) < minDiff) {
                    minDiff = blocks[i].size - proc.size;
                    allocatedIdx = i;
                }
            }
        } else if (algorithm === 'Worst Fit') {
            let maxDiff = -1;
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].isFree && blocks[i].size >= proc.size && (blocks[i].size - proc.size) > maxDiff) {
                    maxDiff = blocks[i].size - proc.size;
                    allocatedIdx = i;
                }
            }
        }

        if (allocatedIdx !== -1) {
            const targetBlock = blocks[allocatedIdx];
            const remainingSpace = targetBlock.size - proc.size;

            targetBlock.isFree = false;
            targetBlock.processId = proc.id;
            targetBlock.size = proc.size;

            // Internal Fragmentation handling (Split the block)
            if (remainingSpace > 0) {
                blocks.splice(allocatedIdx + 1, 0, { size: remainingSpace, isFree: true });
            }
            snap(`Allocated Process ${proc.id} to Block using ${algorithm}.`, null);
        } else {
            snap(`Failed to allocate Process ${proc.id}. External Fragmentation!`, null);
        }
    }

    if (performCompaction) {
        snap("Initiating Compaction to resolve External Fragmentation...", null);
        const usedBlocks = blocks.filter(b => !b.isFree);
        const freeTotal = blocks.filter(b => b.isFree).reduce((acc, b) => acc + b.size, 0);
        
        blocks = [...usedBlocks];
        if (freeTotal > 0) {
            blocks.push({ size: freeTotal, isFree: true });
        }
        snap(`Compaction Complete. ${freeTotal}KB merged into one contiguous block.`, null);
    }

    return steps;
};