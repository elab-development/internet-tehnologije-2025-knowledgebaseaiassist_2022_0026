function DocumentComponent({doc, onDelete, onEdit}){

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("sr-RS") + " u " + date.toLocaleTimeString("sr-RS", { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4 w-full max-w-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 truncate max-w-[200px]" title={doc.title}>
                        {doc.title}
                    </h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-black/10 uppercase">
                        {doc.doc_type}
                    </span>
                </div>
                <div className="text-gray-400">
                    {/* Ovde možeš staviti ikonicu dokumenta */}
                    📄
                </div>
            </div>

            {/* Srednji deo: Tagovi */}
            <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Donji deo: Info i Akcije */}
            <div className="mt-2 border-t pt-4 flex flex-col gap-3">
                <div className="text-xs text-gray-500 italic">
                    Otpremljeno: {formatDate(doc.created_at)}
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => onEdit(doc.id)}
                        className="flex-1 px-3 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
                    >
                        Izmeni
                    </button>
                    <button 
                        onClick={() => onDelete(doc.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                    >
                        Obriši
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DocumentComponent