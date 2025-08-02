// Sorting Algorithm complexities
export const SORTING_COMPLEXITY = {
    'Bubble Sort': {
        time: 'O(n^2)',
        space: 'O(1)',
    },
    'Selection Sort': {
        time: 'O(n^2)',
        space: 'O(1)',
    },
    'Insertion Sort': {
        time: 'O(n^2)',
        space: 'O(1)',
    },
    'Merge Sort': {
        time: 'O(nlog n)',
        space: 'O(n)',
    },
    'Quick Sort': {
        time: 'O(nlogn) average, O(n^2) worst',
        space: 'O(logn) average, O(n) worst',
    },
    'Heap Sort': {
        time: 'O(nlogn)',
        space: 'O(1)',
    },
    'Counting Sort': {
        time: 'O(n + k)',
        space: 'O(n+k)',
    },
};

// Searching Algorithm complexities
export const SEARCHING_COMPLEXITY = {
    'Linear Search': {
        time: 'O(n)',
        space: 'O(1)',
    },
    'Binary Search': {
        time: 'O(logn)',
        space: 'O(1)',
    },
    'Exponential Search': {
        time: 'O(logi) where i is the position of the target, O(log n) in the worst case',
        space: 'O(1)',
    },
    'Interpolation Search': {
        time: 'O(loglog n) average, O(n) worst',
        space: 'O(1)',
    },
};
