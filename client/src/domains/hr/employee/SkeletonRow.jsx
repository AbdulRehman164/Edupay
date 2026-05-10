function SkeletonRow() {
    return (
        <tr>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
                        <div className="h-2.5 w-24 rounded bg-slate-100 animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-3.5">
                <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
            </td>
            <td className="px-5 py-3.5 text-right">
                <div className="h-7 w-16 rounded-md bg-slate-100 animate-pulse ml-auto" />
            </td>
        </tr>
    );
}

export default SkeletonRow;
