export default function TenantSettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Paramètres</h1>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
                <h2 className="text-xl font-semibold text-white mb-4">Mon Compte</h2>
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-neutral-400">Email</label>
                        <input disabled className="bg-neutral-950 border border-neutral-800 rounded-md p-2 text-neutral-500" value="utilisateur@exemple.com" />
                    </div>
                    <button className="text-red-500 text-sm hover:underline">Supprimer mon compte</button>
                </div>
            </div>
        </div>
    );
}
