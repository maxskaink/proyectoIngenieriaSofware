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
            <div>
                <button className='button-size' onClick={() => setSizeText("small")}>Normal</button>
                <button className='button-size' onClick={() => setSizeText("medium")}>Grande</button>
                <button className='button-size' onClick={() => setSizeText("large")}>Extra Grande</button>
            </div>
        </div>
    );
};
