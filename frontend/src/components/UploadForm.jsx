import { useState, useEffect } from "react"
import FormField from "./FormField"
import ButtonComponent from "./ButtonComponent"
import api from "../api"

function UploadForm({isOpen, onClose, editingDoc, allTags = []}){


// cuvamo vrednosti za kasnije eventualno slanje bekendu
const [docTitle,setDocTitle]=useState("")
const [uploadedFile,setUploadedFile]=useState(null)
const [docDescription,setDocDescription]=useState("")
const [tagName,setTagName]=useState("")
const [tagColor,setTagColor]=useState("#DEFF5C")
const [docTags,setDocTags]=useState([])
const [loading, setLoading]= useState(false)

useEffect(() => {
    if(editingDoc){
        setDocTitle(editingDoc.title);
        setDocDescription(editingDoc.description);
        setDocTags(editingDoc.tags);
    }
    else{
        setDocTitle("");
    setUploadedFile(null);
    setDocDescription("");
    setTagName("");
    setTagColor("#DEFF5C");
    setDocTags([]);
    }
}, [editingDoc]); // ako nema editing doc onda samo nista nece da se desi, ako ima, polja ce biti popunjena podacima

if(!isOpen)return


const resetForm = () => {
    setDocTitle("");
    setUploadedFile(null);
    setDocDescription("");
    setTagName("");
    setTagColor("#DEFF5C");
    setDocTags([]);
};

const availableTags = allTags.filter(tag => !docTags.some(dt => dt.id === tag.id)); // brisemo one koji su vec dodati

    const onSelectExistingTag = (e) => {
        const tagId = e.target.value;
        if(!tagId) return; // select tag placeholder je izabran, nema sta dalje

        const tag = allTags.find(t => t.id===Number(tagId));// nalazi se tag koji se dodaje po id
        setDocTags(prev => [...prev, tag]); //dodaj izabrani tag, odmah se updatuje dropdown
        
        e.target.value = ""; //vrati select nazad na placeholder posle izbora
    };

const handleSubmit = async (e)=>{
    setLoading(true);
    e.preventDefault()

    // moramo da koristimo FormData jer inace bi se fajlovi slali u JSON formatu, nego zapravo se cuvali fajlovi
    const formData = new FormData();
    formData.append("title", docTitle);
    formData.append("description", docDescription);

    // izmenio sam ovo vuce, ako se ne doda fajl onda patch, ne menjamo ga
    if(uploadedFile){
        formData.append("file", uploadedFile);}

    if(docTags.length>0){ //ako nisu dodati tagovi ne saljemo ih
    docTags.forEach(tag => {
        formData.append("tags", tag.id); // izvlacimo ideve jer mi ne da ceo objekat da prosledim
    });}
    try{
        if(editingDoc){
            await api.patch(`/api/document/edit/${editingDoc.id}/`,formData)
        }
        else{
            await api.post("/api/document/upload/",formData)
        }
        
        resetForm(); // resetuje polja, "cisti memoriju" nakon zatvaranja forme
        onClose();
    }
    catch(error){
        alert(editingDoc?"Unsucessful file edit":"Unsucessful file upload")
    }
    finally{setLoading(false)
}
    
}

const onAddTag = async (e)=>{
    e.preventDefault()
    if(!tagName.trim()) return;//ispravio bag, ako je prazno ime samo iskuliraj
    const newTag = {
        name: tagName,
        color: tagColor
    }
    try{
        const response = await api.post("/api/tag/create/",newTag)
        const newTagFull = response.data;
        // dodajemo listi tagova ovog dokumenta novi tag
        setDocTags(prevtags=>[...prevtags,newTagFull]) 
        setTagName("")
    }
    catch(error){
        alert("Unsuccessful tag creation")
    }
}

const submitLabel = loading===true?"loading":"upload";


return <div className="fixed z-[100]   w-288 h-auto flex items-center self-center justify-center  backdrop-blur-xs  drop-shadow-md ">
            <div className="bg-[#575757] m-12 p-12  rounded-2xl w-full  shadow-2xl relative">
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-12 ">
                    <FormField 
                        type="text" 
                        placeholder="title" 
                        value={docTitle}
                        // className="border-b-2 p-2 outline-none focus:border-[#DEFF5C]"
                        onChange={(e) => setDocTitle(e.target.value)}
                        required
                    />
                    
                    <FormField 
                        type="file" 
                         className="p-2 border-2 border-dotted border-black/10"
                        onChange={(e) => setUploadedFile(e.target.files[0])} // uzimamo prvi fajl
                        required = {!editingDoc} // ako je edit ne mora fajl da se menja
                        />

                    <div className="relative">
                    <div className="absolute inset-0 bg-[#E7E7E7] blur-sm pointer-events-none"></div>
                    <textarea 
                        placeholder="description (optional)"
                        value={docDescription}
                        className="relative z-10 w-full h-full border-2 border-dotted border-black/10 p-2 h-24 outline-none rounded-lg"
                        onChange={(e) => setDocDescription(e.target.value)}
                    /></div>

                    {/* za tagove */}
                    <div className="flex w-160 gap-12">
                    <FormField 
                        type="text" 
                        placeholder="tag name" 
                        //value={tagName}
                        className=" flex-3 border-b-2 p-2 outline-none"
                        onChange={(e) => setTagName(e.target.value)}
                    />
                    <input
                        type="color"
                        value={tagColor}
                        onChange={(e) => setTagColor(e.target.value)}
                        className="flex-1  w-12 h-12 "
                    ></input>
                    <button type="button" onClick={onAddTag} className="flex-1 text-base w-12 h-12 bg-[#DEFF5C]/30 text-white uppercase ">add tag</button>
                   
                    {/*izbor postojecih, cim se izabere odda se*/}
                    {availableTags.length > 0 && (
                        <select 
                            onChange={onSelectExistingTag}
                            defaultValue=""
                            className="flex-2 w-12 h-10 bg-[#575757] text-white text-base px-2"
                        >
                         <option value="">select existing</option>
                             {availableTags.map(tag => (
                         <option key={tag.id} value={tag.id} style={{backgroundColor: tag.color}}>
                             {tag.name}
                        </option>
                            ))}
                        </select>
                        )}

                    </div>
                    
                    
                    {/*prikazani vec dodatitagovi*/}
                    {docTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {docTags.map(tag => (
                                <span key={tag.id} style={{backgroundColor: tag.color}} className="text-base px-2 py-1 rounded-full text-white cursor-pointer transition-all duration-200 hover:blur-lg"
                                onClick={() => setDocTags(prev => prev.filter(t => t.id!==tag.id))}>
                                    {tag.name}
                                    
                                </span>  ))}
                        </div>
                    )}

                    <div className="flex items-center">
                    <ButtonComponent label={submitLabel} className="bg-[#DEFF5C] " textColor="text-[#575757]"></ButtonComponent></div>
                    <button type="button" onClick={onClose} className="text-xs text-gray-400 uppercase">Cancel</button>
                </form>
            </div>
        </div>





}

export default UploadForm