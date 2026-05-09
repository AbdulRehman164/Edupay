function DashboardHeader() {
    return (
        <header className="px-8 py-4 flex items-center justify-between border-b border-gray-200 bg-white">
            <div>
                <h1 className="text-base font-semibold text-slate-800 tracking-tight">
                    Payslip Generator
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                    HR Operations · Edupay
                </p>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-3 py-1">
                HR
            </span>
        </header>
    );
}

export default DashboardHeader;
