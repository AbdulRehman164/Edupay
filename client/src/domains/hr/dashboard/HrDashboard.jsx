import DashboardHeader from './DashboardHeader';
import UploadAndGenerate from './UploadAndGenerate';
import CompletedJobsTable from './CompletedJobsTable';

const HrDashboard = () => {
    // download helper
    const handleDownload = async (dlId, filename = 'payslips.zip') => {
        const a = document.createElement('a');
        a.href = `/api/hr/payslips/download/${dlId}`;
        a.download = filename;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <DashboardHeader />
            <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {/* Upload + Generate card */}
                <UploadAndGenerate handleDownload={handleDownload} />
                {/* Completed jobs table */}
                <CompletedJobsTable handleDownload={handleDownload} />
            </main>
        </div>
    );
};

export default HrDashboard;
