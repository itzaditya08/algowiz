export const insertionSort = (arr) => {
    const steps = [];
    const n = arr.length;

    steps.push({ array: [...arr], type: 'start' });

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        steps.push({ array: [...arr], type: 'round', round: i });
        
        // This is a comparison, but also a loop check
        while (j >= 0 && arr[j] > key) {
            steps.push({ array: [...arr], type: 'compare', indices: [j, i] });
            arr[j + 1] = arr[j];
            steps.push({ array: [...arr], type: 'shift', indices: [j, j + 1] });
            j = j - 1;
        }

        if (j + 1 !== i) { // Check if a swap/insertion actually occurred
            arr[j + 1] = key;
            steps.push({ array: [...arr], type: 'swap', indices: [j + 1, i] });
        }
    }

    // Mark all elements as sorted at the end
    steps.push({ array: [...arr], type: 'sorted', indices: Array.from({length: n}, (_, k) => k) });

    return steps;
};
