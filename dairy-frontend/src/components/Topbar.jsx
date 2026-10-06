export default function Topbar() {
    return (
        <header className="fixed left-64 right-0 top-0 z-10 h-16 border-b bg-white">
            <div className="flex h-full items-center justify-between px-8">

                <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Dairy Farm Management
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                            Admin
                        </p>

                        <p className="text-xs text-slate-500">
                            Farm Manager
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                        A
                    </div>
                </div>

            </div>
        </header>
    );
}