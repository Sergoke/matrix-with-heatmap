import { useContext } from "react";
import { MatrixContext } from "../context/MatrixContext";

export const useMatrix = () => {
    const context = useContext(MatrixContext);
    if (!context) {
        throw new Error("useMatrix must be used within MatrixProvider");
    }
    return context;
};
