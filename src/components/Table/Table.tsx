
import { useState } from "react";
import { useMatrix } from "../../hooks/useMatrix";
import "./Table.css";

const Table = ({ X }: { X: number }) => {
    const { matrix, rowSums, percentileRow, highlightedCells, hoveredRowPercentages, incrementCell, handleCellHover, handleRowSumHover, addRow, removeRow } = useMatrix();
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const getCellBackgroundColor = (heatmapValue: number) => {
        const redValue = 255 - Math.round((heatmapValue / 100) * 255);
        return `rgb(255, ${redValue}, ${redValue})`;
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {matrix[0].map((_, colIndex) => (
                            <th key={colIndex}>N = {colIndex + 1}</th>
                        ))}
                        <th>Sum</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{rowIndex+1}</td>
                            {row.map((cell, colIndex) => {
                                const cellPercentage = hoveredRowPercentages ? hoveredRowPercentages[colIndex].percent : null;
                                const cellHeatmapValue = hoveredRowPercentages ? hoveredRowPercentages[colIndex].heatmapValue : null;

                                return (
                                    <td 
                                        key={cell.id} 
                                        onClick={() => incrementCell(rowIndex, colIndex)}
                                        onMouseEnter={() => handleCellHover(rowIndex, colIndex, X)}
                                        onMouseLeave={() => handleCellHover(null, null, 0)}
                                        className={`cell-number ${highlightedCells.includes(cell.id) ? "highlighted" : ""}`}
                                        style={{ backgroundColor: hoveredRow === rowIndex && cellHeatmapValue ? getCellBackgroundColor(cellHeatmapValue) : "" }}
                                    >
                                        {hoveredRow === rowIndex && cellPercentage !== null ? `${cellPercentage.toFixed(1)}%` : cell.amount}
                                    </td>
                                );
                            })}
                            <td
                                onMouseEnter={() => {
                                    setHoveredRow(rowIndex);
                                    handleRowSumHover(rowIndex);
                                }}
                                onMouseLeave={() => {
                                    setHoveredRow(null);
                                    handleRowSumHover(null);
                                }}
                            >
                                {rowSums[rowIndex]}
                            </td>
                            <td><button className="btn-remove" onClick={() => removeRow(rowIndex)}>X</button></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>50th Percentile</td>
                        {percentileRow.map((value, colIndex) => (
                            <td key={colIndex}>{value}</td>
                        ))}
                    </tr>
                </tfoot>
            </table>
            <button onClick={addRow}>Add Row</button>
        </div>
    );
};

export default Table;