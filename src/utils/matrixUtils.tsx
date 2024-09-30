import { Cell } from "../context/MatrixContext";

export const generateMatrix = (M: number, N: number, prevCellId: number = 0): Cell[][] => {
    let cellId = prevCellId;

    return Array.from({ length: M }, () =>
        Array.from({ length: N }, () => ({
            id: ++cellId,
            amount: Math.floor(Math.random() * 1000),
        }))
    );
};

export const calculateRowSums = (matrix: Cell[][]): number[] => {
    return matrix.map((row) => row.reduce((sum, cell) => sum + cell.amount, 0));
};

export const calculatePercentile = (matrix: Cell[][]): number[] => {
    const transpose = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    return transpose.map((column) => {
        const sorted = column.map(cell => cell.amount).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
    });
};

export const findNearestCells = (hoveredCell: Cell, X: number, matrix: Cell[][]): Cell[] => {
    const allCells = matrix.flat();
    const sortedCells = allCells
        .filter((cell) => cell.id !== hoveredCell.id)
        .sort((a, b) => Math.abs(a.amount - hoveredCell.amount) - Math.abs(b.amount - hoveredCell.amount));

    return sortedCells.slice(0, X);
};
