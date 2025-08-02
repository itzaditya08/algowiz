export const selectionSort = (arr) => {
    const steps = [];
    let n = arr.length;

    steps.push({ array: [...arr], type: 'start' });

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        steps.push({ array: [...arr], type: 'round', round: i + 1 });

        for (let j = i + 1; j < n; j++) {
            steps.push({ array: [...arr], type: 'compare', indices: [j, minIndex] });
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            steps.push({ array: [...arr], type: 'swap', indices: [i, minIndex] });
        }
        steps.push({ array: [...arr], type: 'sorted', indices: [i] });
    }

    steps.push({ array: [...arr], type: 'sorted', indices: [n - 1] });
    
    return steps;
};
