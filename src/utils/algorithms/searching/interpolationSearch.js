// Interpolation Search is an improvement over Binary Search for uniformly distributed data.
export const interpolationSearch = (arr, target) => {
    const steps = [];
    const n = arr.length;
    let low = 0;
    let high = n - 1;
    let found = false;

    steps.push({ array: [...arr], type: 'start', target: target });

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        // Formula for interpolation search
        const pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));

        steps.push({ array: [...arr], type: 'compare', indices: [pos], range: [low, high], target: target });

        if (arr[pos] === target) {
            steps.push({ array: [...arr], type: 'found', indices: [pos], range: [low, high], target: target });
            found = true;
            break;
        } else if (arr[pos] < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
    }

    if (!found) {
        steps.push({ array: [...arr], type: 'not_found', target: target });
    }

    return steps;
};
