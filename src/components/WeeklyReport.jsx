import { Report } from './Report.jsx';
import { useState, useEffect } from 'react';
import { getInforms } from '../helpers/querys.js';

export const WeeklyReport = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    const [sizeText, setSizeText] = useState("small");

    useEffect(() => {
        getInforms().then((res) => {
            setReports(res.data);
            if (res.data.length > 0) {
                setSelectedReport(res.data[res.data.length - 1]);
            }
        });
    }, []);

    const handleSelectChange = (event) => {
        const selectedReportFecha = event.target.value;
        const selectedReport = reports.find((report) => report.SEMANA === selectedReportFecha);
        setSelectedReport(selectedReport);
    };

    return (
        <div>
            <h1 className='title-stock'>Reportes Semanales</h1>
            <div className='container-buttons'>
                <div className='buttons-informe'> <i className="fa-solid fa-magnifying-glass-plus"></i></div>
                <button className='buttons-informe' onClick={() => setSizeText("small")}>1</button>
                <button className='buttons-informe2' onClick={() => setSizeText("medium")}>2</button>
                <button className='buttons-informe3' onClick={() => setSizeText("large")}>3</button>
            </div>
        
            {reports.length > 0 ? (
                <div>
                     <select className='selectFecha' name="reportSelect" id="reportSelect" onChange={handleSelectChange}>
                        {reports.map((infoReport) => (
                            <option key={infoReport.SEMANA} value={infoReport.SEMANA}>
                                {infoReport.SEMANA}
                            </option>
                        ))}
                    </select>
                    {selectedReport ? (
                        <Report infoReport={selectedReport} sizeText={sizeText} />
                    ) : (
                        <p>No hay informes disponibles.</p>
                    )}

                   
                </div>
            ) : (
                <p>No hay informes disponibles.</p>
            )}
    
        </div>
    );
};
