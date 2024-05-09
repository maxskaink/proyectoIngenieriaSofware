import { Report } from './Report.jsx';
import { useState, useEffect } from 'react';
import { getInforms } from '../helpers/querys.js';

export const WeeklyReport = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

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
            <h1>Reportes Semanales</h1>
            {reports.length > 0 ? (
                <div>
                    {selectedReport ? (
                        <Report infoReport={selectedReport} />
                    ) : (
                        <p>No hay informes disponibles.</p>
                    )}

                    <select name="reportSelect" id="reportSelect" onChange={handleSelectChange}>
                        {reports.map((infoReport) => (
                            <option key={infoReport.SEMANA} value={infoReport.SEMANA}>
                                {infoReport.SEMANA}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <p>No hay informes disponibles.</p>
            )}
        </div>
    );
};
