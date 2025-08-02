export const binarySearch = (arr, target) => {
    const steps = [];
    let low = 0;
    let high = arr.length - 1;
    let found = false;

    // Push initial state
    steps.push({ array: [...arr], type: 'start', target: target });

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        
        // Visualize the current range and the middle element
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
