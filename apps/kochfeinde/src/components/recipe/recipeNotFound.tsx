export default function RecipeNotFound({ slug }: { slug?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-xl text-gray-500 mb-2">
                Rezept nicht gefunden
            </p>
            {slug && (
                <p className="text-sm text-gray-400 font-mono">
                    „{slug}"
                </p>
            )}
        </div>
    )
}