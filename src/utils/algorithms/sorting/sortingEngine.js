const createStep = (arr, active, sorted, msg) => ({
    array: [...arr], activeIndices: [...active], sortedIndices: [...sorted], message: msg
});

export const generateSortingSteps = (initialArray, algorithm) => {
    const steps = [];
    let arr = [...initialArray].map((val, id) => ({ val, id: `${val}-${id}` })); // Preserve stable IDs for Framer Motion layout animations
    const n = arr.length;
    let sortedIndices = [];

    steps.push(createStep(arr, [], [], `Starting ${algorithm} Sort.`));

    if (algorithm === 'Bubble Sort') {
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                steps.push(createStep(arr, [j, j + 1], sortedIndices, `Comparing ${arr[j].val} and ${arr[j+1].val}`));
                if (arr[j].val > arr[j + 1].val) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    steps.push(createStep(arr, [j, j + 1], sortedIndices, `Swapped ${arr[j].val} and ${arr[j+1].val}`));
                }
            }
            sortedIndices.push(n - i - 1);
            steps.push(createStep(arr, [], sortedIndices, `${arr[n - i - 1].val} is now sorted.`));
        }
        sortedIndices.push(0);
    } 
    else if (algorithm === 'Selection Sort') {
        for (let i = 0; i < n; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                steps.push(createStep(arr, [minIdx, j], sortedIndices, `Comparing current min ${arr[minIdx].val} with ${arr[j].val}`));
                if (arr[j].val < arr[minIdx].val) minIdx = j;
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                steps.push(createStep(arr, [i, minIdx], sortedIndices, `Swapped min ${arr[i].val} to front.`));
            }
            sortedIndices.push(i);
        }
    }
    else if (algorithm === 'Insertion Sort') {
        sortedIndices.push(0);
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            steps.push(createStep(arr, [i], sortedIndices, `Evaluating ${key.val}`));
            while (j >= 0 && arr[j].val > key.val) {
                steps.push(createStep(arr, [j, j + 1], sortedIndices, `${arr[j].val} > ${key.val}, shifting right.`));
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
            sortedIndices.push(i);
            steps.push(createStep(arr, [j + 1], sortedIndices, `Inserted ${key.val} at correct position.`));
        }
    }
    else if (algorithm === 'Merge Sort') {
        const mergeSortHelper = (l, r) => {
            if (l >= r) return;
            const m = Math.floor(l + (r - l) / 2);
            mergeSortHelper(l, m);
            mergeSortHelper(m + 1, r);
            merge(l, m, r);
        };
        const merge = (l, m, r) => {
            const left = arr.slice(l, m + 1);
            const right = arr.slice(m + 1, r + 1);
            let i = 0, j = 0, k = l;
            while (i < left.length && j < right.length) {
                steps.push(createStep(arr, [l + i, m + 1 + j], sortedIndices, `Merging: Comparing ${left[i].val} and ${right[j].val}`));
                if (left[i].val <= right[j].val) arr[k++] = left[i++];
                else arr[k++] = right[j++];
                steps.push(createStep(arr, [k - 1], sortedIndices, `Placed ${arr[k-1].val} into merged array.`));
            }
            while (i < left.length) { arr[k++] = left[i++]; steps.push(createStep(arr, [k - 1], sortedIndices, `Placed remaining ${arr[k-1].val}.`)); }
            while (j < right.length) { arr[k++] = right[j++]; steps.push(createStep(arr, [k - 1], sortedIndices, `Placed remaining ${arr[k-1].val}.`)); }
            for (let x = l; x <= r; x++) if (!sortedIndices.includes(x)) sortedIndices.push(x);
        };
        mergeSortHelper(0, n - 1);
    }
    else if (algorithm === 'Quick Sort') {
        const quickSortHelper = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                sortedIndices.push(pi);
                steps.push(createStep(arr, [], sortedIndices, `Pivot ${arr[pi].val} locked in place.`));
                quickSortHelper(low, pi - 1);
                quickSortHelper(pi + 1, high);
            } else if (low === high) {
                sortedIndices.push(low);
            }
        };
        const partition = (low, high) => {
            const pivot = arr[high].val;
            let i = low - 1;
            steps.push(createStep(arr, [high], sortedIndices, `Selected Pivot: ${pivot}`));
            for (let j = low; j < high; j++) {
                steps.push(createStep(arr, [j, high], sortedIndices, `Comparing ${arr[j].val} with pivot ${pivot}`));
                if (arr[j].val < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    steps.push(createStep(arr, [i, j], sortedIndices, `Swapped ${arr[i].val} and ${arr[j].val}`));
                }
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            steps.push(createStep(arr, [i + 1, high], sortedIndices, `Moved pivot ${pivot} to correct index.`));
            return i + 1;
        };
        quickSortHelper(0, n - 1);
    }

    steps.push(createStep(arr, [], arr.map((_, i) => i), "Array is fully sorted!"));
    return steps;
};