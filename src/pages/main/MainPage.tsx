import { useState, useEffect } from "react";

import './MainPage.css';
import { MatrixProvider } from "../../context/MatrixContext";
import Table from "../../components/Table/Table";

function MainPage() {
    const [M, setM] = useState<number>(4);
    const [N, setN] = useState<number>(5);
    const [X, setX] = useState<number>(3);

    useEffect(() => {
        setX(Math.max(1, Math.min(M * N - 2, X)));
    }, [M, N, X]);

    return (
        <div className="main">
            <div className="input-container">
                <div className="input-group">
                    <label htmlFor='input-m'>M:</label>
                    <input id='input-m' type='number' value={M} onChange={(e) => setM(Math.max(1, Number(e.target.value)))} min='1' max='100' />
                </div>
                <div className="input-group">
                    <label htmlFor='input-n'>N:</label>
                    <input id='input-n' type='number' value={N} onChange={(e) => setN(Math.max(1, Number(e.target.value)))} min='1' max='100' />
                </div>
                <div className="input-group">
                    <label htmlFor='input-x'>X:</label>
                    <input id='input-x' type='number' value={X} onChange={(e) => setX(Number(e.target.value))} min='1' max={M * N - 2} />
                </div>
            </div>

            <MatrixProvider key={`${M}-${N}`} M={M} N={N}>
                <Table X={X} />
            </MatrixProvider>
        </div>
    );
}

export default MainPage;
