// Exponential Search is an optimization of Binary Search.
// It first finds a range where the target might exist, then performs a binary search within that range.
export const exponentialSearch = (arr, target) => {
    const steps = [];
    const n = arr.length;
    let found = false;

    steps.push({ array: [...arr], type: 'start', target: target });

    if (arr[0] === target) {
        steps.push({ array: [...arr], type: 'found', indices: [0], target: target });
        return steps;
    }

    let i = 1;
    while (i < n && arr[i] <= target) {
        steps.push({ array: [...arr], type: 'range_check', indices: [i], target: target });
        i = i * 2;
    }

    let low = Math.floor(i / 2);
    let high = Math.min(i, n - 1);
    
    steps.push({ array: [...arr], type: 'range_found', range: [low, high], target: target });

    // Perform Binary Search in the found range
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        steps.push({ array: [...arr], type: 'compare', indices: [mid], range: [low, high], target: target });

        if (arr[mid] === target) {
            steps.push({ array: [...arr], type: 'found', indices: [mid], range: [low, high], target: target });
            found = true;
            break;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    if (!found) {
        steps.push({ array: [...arr], type: 'not_found', target: target });
    }

    return steps;
};
