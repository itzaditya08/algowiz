export const bubbleSort = (arr) => {
    const steps = [];
    let n = arr.length;
    let swapped;

    steps.push({ array: [...arr], type: 'start' });

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        steps.push({ array: [...arr], type: 'round', round: i + 1 });
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({ array: [...arr], type: 'compare', indices: [j, j + 1] });

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                steps.push({ array: [...arr], type: 'swap', indices: [j, j + 1] });
            }
        }
        steps.push({ array: [...arr], type: 'sorted', indices: [n - 1 - i] });

        if (!swapped) {
            break;
        }
    }

    // Mark remaining elements as sorted
    for (let i = 0; i < n; i++) {
        if (!steps.some(step => step.type === 'sorted' && step.indices.includes(i))) {
             steps.push({ array: [...arr], type: 'sorted', indices: [i] });
        }
    }

    return steps;
};
