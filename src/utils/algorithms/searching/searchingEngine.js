export const generateSearchingSteps = (array, target, algorithm) => {
    const steps = [];
    const arr = [...array];
    let foundIndex = -1;

    const snap = (active, range, msg) => {
        steps.push({ array: [...arr], target, activeIndices: [...active], searchRange: [...range], foundIndex, message: msg });
    };

    snap([], [0, arr.length - 1], `Starting ${algorithm} Search for target: ${target}`);

    if (algorithm === 'Linear Search') {
        for (let i = 0; i < arr.length; i++) {
            snap([i], [0, arr.length - 1], `Checking if ${arr[i]} === ${target}`);
            if (arr[i] === target) {
                foundIndex = i;
                snap([i], [0, arr.length - 1], `Target ${target} found at index ${i}!`);
                break;
            }
        }
        if (foundIndex === -1) snap([], [], `Target ${target} not found in array.`);
    } 
    else if (algorithm === 'Binary Search') {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor(low + (high - low) / 2);
            snap([mid], [low, high], `Search Space: [${low}..${high}]. Mid is index ${mid} (${arr[mid]}).`);
            
            if (arr[mid] === target) {
                foundIndex = mid;
                snap([mid], [low, high], `Target ${target} found at index ${mid}!`);
                break;
            } else if (arr[mid] < target) {
                snap([mid], [low, high], `${arr[mid]} < ${target}. Discarding left half.`);
                low = mid + 1;
            } else {
                snap([mid], [low, high], `${arr[mid]} > ${target}. Discarding right half.`);
                high = mid - 1;
            }
        }
        if (foundIndex === -1) snap([], [], `Target ${target} not found.`);
    }
    else if (algorithm === 'Exponential Search') {
        if (arr[0] === target) {
            foundIndex = 0;
            snap([0], [0, 0], `Target found at index 0!`);
            return steps;
        }
        let i = 1;
        while (i < arr.length && arr[i] <= target) {
            snap([i], [0, arr.length - 1], `Checking exponential bound at index ${i} (${arr[i]}) <= ${target}`);
            i *= 2;
        }
        
        let low = Math.floor(i / 2);
        let high = Math.min(i, arr.length - 1);
        snap([], [low, high], `Target bound found. Binary Searching between indices [${low}..${high}].`);
        
        // Internal Binary Search
        while (low <= high) {
            let mid = Math.floor(low + (high - low) / 2);
            snap([mid], [low, high], `Mid is index ${mid} (${arr[mid]}).`);
            if (arr[mid] === target) {
                foundIndex = mid;
                snap([mid], [low, high], `Target ${target} found at index ${mid}!`);
                break;
            } else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        if (foundIndex === -1) snap([], [], `Target ${target} not found.`);
    }

    return steps;
};