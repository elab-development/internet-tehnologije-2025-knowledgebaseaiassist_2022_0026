import SideMenuComponent from "../components/SideMenuComponent"
import DocumentComponent from "../components/DocumentComponent";
import FormField from "../components/FormField";
import React, { useState, useEffect } from "react";
import ButtonComponent from "../components/ButtonComponent";
import UploadForm from "../components/UploadForm";
import api from "../api";

function DocumentManager(){

    const [searchText, setSearchText] = useState("")
    const [documents, setDocuments] = useState([])
    const [allTags, setAllTags] = useState([])
    const [uploadFormOpen, setUploadFormOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedTag , setSelectedTag] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const [editingDoc, setEditingDoc] = useState(null);
    // const getDocument() =>{}


    const getDocuments = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/document/upload/"); 
            setDocuments(response.data);
        } catch (error) {
            console.error("Error while loading the documents:", error);
            alert("Loading your documents was not successful.");
        } finally {
            setLoading(false);
        }
    };

    // za selectbox za filtriranje tagova 
    const getTags = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/tag/create/"); 
            setAllTags(response.data);
        } catch (error) {
            console.error("Error while loading the tags:", error);
            alert("Loading your tags was not successful");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDocuments();
        getTags();
    }, []); // mozda proemnei parametar uploadFormOpen    

    

    //dokumenti filtirarni preko search bara
    // case sensitive, gledamo da li nazivi dokumenata sadrze tekst koji se nalazi u search baru
    const filteredDocs = documents.filter(doc => (
        doc.title.toLowerCase().includes(searchText.toLowerCase()) &&
       ((selectedTag===""&&doc.tags.length===0)||(doc.tags.some(tag=> tag.name.toLowerCase().includes(selectedTag.toLowerCase())))) && 
        doc.file_type.toLowerCase().includes(selectedType.toLowerCase())
    )
    );


    // mock dokument za probu dokument kartica
    const mockDoc = {
        id: 1,
        title: "Diplomski_Rad_Final.pdf",
        doc_type: "PDF",
        tags: ["faks", "draft", "bitno"],
        created_at: "2026-02-07T16:40:00Z"
    };

    const handleEdit = (id) => {
    const doc = documents.find(d => d.id === id); // nadje dokument
    setEditingDoc(doc); // postavi ga za menjanje
    setUploadFormOpen(true);
};

    // funkcija za brisanje dokumenta
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this document?"); //dijalog za potvrdu
        if(confirmed){
            try{
                const response = await api.delete(`/api/document/delete/${id}/`)
                setDocuments(documents.filter(docum=> docum.id !== id)) // brze brisanje iz liste od getDocuments()
            }
            catch(error){
                alert("Deleting the document was unsuccessful. :(")
            }

        }
    }

    // ----------------------------------------------------------------------RETURN KOD-------------------------------------------------------------

    return <div className="flex min-h-screen">
        {/*glavni sadrzaj stranice */}
        <main className="flex-1 flex flex-col ml-18 mr-18">
            <div className="flex w-full bg-blue items-center gap-12 p-12 pt-8">
                <h1 className="text-7xl font-dots leading-none">Knowledge Base</h1>
                <FormField type="text" placeholder="search" value={searchText} onChange={(e)=>setSearchText(e.target.value)} ></FormField>

                {/* filteri */}
                <select 
                className="w-36 h-12 border border-gray-300 bg-[#575757] text-white drop-shadow-md text-right pr-4"
                onChange={(e)=>setSelectedTag(e.target.value)}>
                    <option value="">filter tags</option>
                    {allTags.map((tag)=>(
                       <option key={tag.id} value={tag.name} style={{backgroundColor: tag.color, fontWeight: 300, textAlign: "right" }}>{ tag.name}</option>
                    )
                    )}
                </select>

                <select 
                className="w-36 h-12 border border-gray-300 bg-[#575757] text-white drop-shadow-md text-right pr-4"
                onChange={(e)=>setSelectedType(e.target.value)}>
                    <option value="">filter file types</option>
                    
                    <option value="pdf">PDF</option>
                    <option value="txt">TXT</option>
                    <option value="md">MD</option>
                </select>
            </div>

            <div className="px-12 flex flex-col">
                {/* <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={mockDoc} onEdit={handleEdit} onDelete={handleDelete} /> */}

                    {/* ako se loaduju, prikazi loading documents */}
                {loading ? (<p className="text-[#575757] text-center text-xl ml-12">Loading your documents...</p>) : 
                        // ako se ne loaduje vise nista ako ima dokumenata da se prikazu svi a 
                        filteredDocs.length > 0 ? (filteredDocs.map((doc) => ( 
                            // mapujemo svaki objekat iz niza filteredDocs u jsx i html kod koji predstavlja nasu reusable komponentu
                            <DocumentComponent 
                                key={doc.id} 
                                doc={doc} 
                                onEdit={() => handleEdit(doc.id)} 
                                onDelete={() => handleDelete(doc.id)} />
                        )) ) : 
                        // ako nema dokumenata u filteredDocs, da se prikaze tekst koji kaze da nema
                        (<p className="text-[#575757] text-center text-xl mt-12 ml-12">
                        {/* ovo je reach ali da bude razlicita poruka ako je nesto pretrazeno ili ako samo nema uploadovanih dokumenata */}
                            {searchText||selectedTag||selectedType ? "No documents match your search." : "Woah, your Knowledge Base is empty... Embarrassing..."}
                        </p>
                    )}

            </div>

                    {/* kad se zatvori forma menjamo boolean vrednost koja nam kaze da li je otvorena forma */}
            <UploadForm isOpen={uploadFormOpen} editingDoc={editingDoc} allTags={allTags} onClose={()=>
                {
                    setUploadFormOpen(false)
                    setEditingDoc(null)//mozda redudantno al za svaki slucaj
                    getDocuments(); // kad se zatvori forma se refreshuju dokumenta u listi
                    getTags();
                    
                }}></UploadForm>

            <div className="fixed bottom-12  self-center items-center z-50"
                onClick={()=> {setEditingDoc(null); setUploadFormOpen(true);
                    //editingDoc se brise iz hooka
                    }}> 
            <ButtonComponent label="upload document" textColor=" text-[#DEFF5C]" ></ButtonComponent>
            </div>
        </main>
        <aside>
        <SideMenuComponent
        navigateTo="/ai_chat"
        label = "AI chat"
        side = "left"
        ></SideMenuComponent>
        </aside>
        <aside>
        <SideMenuComponent
        navigateTo="/"
        label = "home"
        side = "right"
        ></SideMenuComponent>
        </aside>
    </div>
}

export default DocumentManager