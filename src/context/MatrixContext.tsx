import React, { createContext, useState, useContext, ReactNode } from "react";
import { generateMatrix, calculateRowSums, calculatePercentile, findNearestCells } from "../utils/matrixUtils";

type CellId = number;
type CellValue = number;

export type Cell = {
    id: CellId;
    amount: CellValue;
};

type MatrixContextType = {
    matrix: Cell[][];
    setMatrix: React.Dispatch<React.SetStateAction<Cell[][]>>;
    rowSums: number[];
    percentileRow: number[];
    highlightedCells: number[];
    hoveredRowPercentages: { percent: number; heatmapValue: number }[] | null;
    addRow: () => void;
    removeRow: (rowIndex: number) => void;
    handleCellHover: (rowIndex: number | null, colIndex: number | null, X: number | null) => void;
    handleRowSumHover: (rowIndex: number | null) => void;
    incrementCell: (rowIndex: number, colIndex: number) => void;
};

export const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export const MatrixProvider = ({ children, M, N }: { children: ReactNode, M: number, N: number }) => {
    const [matrix, setMatrix] = useState<Cell[][]>(() => generateMatrix(M, N));
    const [highlightedCells, setHighlightedCells] = useState<number[]>([]);
    const [hoveredRowPercentages, setHoveredRowPercentages] = useState<{ percent: number; heatmapValue: number }[] | null>(null);

    const rowSums = calculateRowSums(matrix);
    const percentileRow = calculatePercentile(matrix);

    const incrementCell = (rowIndex: number, colIndex: number) => {
        setMatrix((prevMatrix) => {
            const newMatrix = [...prevMatrix];
            newMatrix[rowIndex][colIndex] = {
                ...newMatrix[rowIndex][colIndex],
                amount: newMatrix[rowIndex][colIndex].amount + 1,
            };
            return newMatrix;
        });
    };

    const addRow = () => {
        const lastCellId = matrix[matrix.length - 1][matrix[0].length - 1].id;

        setMatrix((prevMatrix) => [...prevMatrix, generateMatrix(1, prevMatrix[0].length, lastCellId)[0]]);
    };

    const removeRow = (rowIndex: number) => {
        if (matrix.length === 1) return;
        setMatrix((prevMatrix) => prevMatrix.filter((_, index) => index !== rowIndex));
    };

    const handleCellHover = (rowIndex: number | null, colIndex: number | null, X: number | null) => {
        if (rowIndex === null || colIndex === null || X === null) {
            setHighlightedCells([]);
            return;
        }
        const hoveredCell = matrix[rowIndex][colIndex];
        const nearestCells = findNearestCells(hoveredCell, X, matrix);
        setHighlightedCells(nearestCells.map((cell) => cell.id));
    };

    const handleRowSumHover = (rowIndex: number | null) => {
        if (rowIndex === null) {
            setHoveredRowPercentages(null);
            return;
        }

        const row = matrix[rowIndex];
        const total = rowSums[rowIndex];
        const maxInRow = Math.max(...row.map((cell) => cell.amount));

        const percentages = row.map((cell) => ({
            percent: (cell.amount / total) * 100,
            heatmapValue: (cell.amount / maxInRow) * 100,
        }));

        setHoveredRowPercentages(percentages);
    };

    return (
        <MatrixContext.Provider value={{ matrix, setMatrix, rowSums, percentileRow, highlightedCells, incrementCell, handleCellHover, addRow, removeRow, handleRowSumHover, hoveredRowPercentages }}>
            {children}
        </MatrixContext.Provider>
    );
};