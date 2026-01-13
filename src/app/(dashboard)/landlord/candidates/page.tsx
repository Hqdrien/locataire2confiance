export default function LandlordCandidatesPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Mes Candidats
            </h1>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center text-neutral-500">
                <p>Aucun candidat pour le moment.</p>
                <p className="text-sm mt-2">Dès qu'un locataire postule à une de vos annonces, il apparaîtra ici.</p>
            </div>
        </div>
    );
}
