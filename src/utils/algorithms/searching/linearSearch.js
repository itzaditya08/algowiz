export const linearSearch = (arr, target) => {
    const steps = [];
    let found = false;

    // Push initial state
    steps.push({ array: [...arr], type: 'start', target: target });

    for (let i = 0; i < arr.length; i++) {
        // Visualize the current comparison
        steps.push({ array: [...arr], type: 'compare', indices: [i], target: target });
        
        if (arr[i] === target) {
            steps.push({ array: [...arr], type: 'found', indices: [i], target: target });
            found = true;
            break;
        }
    }

    if (!found) {
        steps.push({ array: [...arr], type: 'not_found', target: target });
    }

    return steps;
};
