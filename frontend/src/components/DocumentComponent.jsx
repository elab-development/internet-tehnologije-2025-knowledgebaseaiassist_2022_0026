function DocumentComponent({doc, onDelete, onEdit}){

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("sr-RS") + " at " + date.toLocaleTimeString("sr-RS", { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="group bg-white h-12 flex items-center gap-4 w-full duration-50 transition-all hover:border-dotted hover:border-2 ">
                <div className="flex gap-2">
                <button 
                    onClick={() => onDelete(doc.id)}
                    className="h-12 w-12 flex-1 text-black hover:text-red-700 items-center self-center  text-3xl  transition-colors opacity-0 group-hover:opacity-100 duration-200 active:scale-95"
                >
                    X
                </button></div>

                <div className="flex items-center">
                    <h3 className="text-lg " title={doc.title}>
                        {doc.title}
                    </h3>
                    <span className="text-xs font-bold m-4   text-[#575757] uppercase">
                        {doc.doc_type}
                    </span>
                </div>
            
            <div className="flex-1"></div>
            {/* tagovi */}
            <div className="flex flex-2 gap-2 justify-end">
                {doc.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            {/* datum i dugmici */}
            <div className="flex flex-col gap-3">
                    uploaded {formatDate(doc.created_at)}
            </div>

                <div className="h-12 w-12 flex gap-2 items-center justify-center">
                    <button 
                        onClick={() => onEdit(doc.id)}
                        className=" flex-1 text-[#575757] text-xl  flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 duration-200 hover:text-[#DEFF5C] active:scale-95"
                    >
                        
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-6 h-6"
                        >
                            {/* nacrtane linije za edit simbol */}
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" 
                            />
    </svg>


                    </button>

                    </div>
                </div>

    );
}

export default DocumentComponent