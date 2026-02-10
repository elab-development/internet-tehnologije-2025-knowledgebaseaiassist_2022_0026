import { useState, useEffect } from "react"
import FormField from "./FormField"
import ButtonComponent from "./ButtonComponent"
import api from "../api"

function UploadForm({isOpen, onClose}){


// cuvamo vrednosti za kasnije eventualno slanje bekendu
const [docTitle,setDocTitle]=useState("")
const [uploadedFile,setUploadedFile]=useState(null)
const [docDescription,setDocDescription]=useState("")
const [tagName,setTagName]=useState("")
const [tagColor,setTagColor]=useState("#DEFF5C")
const [docTags,setDocTags]=useState([])
const [loading, setLoading]= useState(false)

if(!isOpen)return


const resetForm = () => {
    setDocTitle("");
    setUploadedFile(null);
    setDocDescription("");
    setTagName("");
    setTagColor("#DEFF5C");
    setDocTags([]); // OVO JE KLJUČNO - praznimo listu tagova
};

const handleSubmit = async (e)=>{
    setLoading(true);
    e.preventDefault()

    // moramo da koristimo FormData jer inace bi se fajlovi slali u JSON formatu, nego zapravo se cuvali fajlovi
    const formData = new FormData();
    formData.append("title", docTitle);
    formData.append("description", docDescription);
    formData.append("file", uploadedFile);

    if(docTags.length>0){ //ako nisu dodati tagovi ne saljemo ih
    docTags.forEach(tag => {
        formData.append("tags", tag.id); // izvlacimo ideve jer mi ne da ceo objekat da prosledim
    });}
    try{
        await api.post("/api/document/upload/",formData)
        resetForm(); // resetuje polja, "cisti memoriju" nakon zatvaranja forme
        onClose();
    }
    catch(error){
        alert("Unsucessful file upload")
    }
    finally{setLoading(false)
}
    
}

const onAddTag = async (e)=>{
    e.preventDefault()
    const newTag = {
        name: tagName,
        color: tagColor
    }

    try{
        const response = await api.post("/api/tag/create/",newTag)
        const newTagFull = response.data;
        setDocTags(prevtags=>[...prevtags,newTagFull]) // dodajemo listi tagova ovog dokumenta novi tag
        setTagName("")

    }
    catch(error){
        alert("Unsuccessful tag creation")
    }
}



return <div className="fixed z-[100]   w-288 h-auto flex items-center self-center justify-center  backdrop-blur-xs  drop-shadow-md ">
            <div className="bg-[#575757] m-12 p-12  rounded-2xl w-full  shadow-2xl relative">
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-12 ">
                    <FormField 
                        type="text" 
                        placeholder="title" 
                        // className="border-b-2 p-2 outline-none focus:border-[#DEFF5C]"
                        onChange={(e) => setDocTitle(e.target.value)}
                        required
                    />
                    
                    <FormField 
                        type="file" 
                         className="p-2 border-2 border-dotted border-black/10"
                        onChange={(e) => setUploadedFile(e.target.files[0])} // uzimamo prvi fajl
                        required/>

                    <div className="relative">
                    <div className="absolute inset-0 bg-[#E7E7E7] blur-sm pointer-events-none"></div>
                    <textarea 
                        placeholder="description (optional)"
                        className="relative z-10 w-full h-full border-2 border-dotted border-black/10 p-2 h-24 outline-none rounded-lg"
                        onChange={(e) => setDocDescription(e.target.value)}
                    /></div>

                    {/* za tagove */}
                    <div className="flex w-120 gap-12">
                    <FormField 
                        type="text" 
                        placeholder="tag name" 
                        className=" flex-3 border-b-2 p-2 outline-none"
                        onChange={(e) => setTagName(e.target.value)}
                    />
                    <input
                        type="color"
                        value={tagColor}
                        onChange={(e) => setTagColor(e.target.value)}
                        className="flex-1  w-12 h-12 "
                    ></input>
                    <button type="button" onClick={onAddTag} className="flex-1 text-xs w-12 h-12 bg-[#DEFF5C]/30 text-white uppercase ">add tag</button>
                    </div>
                    <div className="flex items-center">
                    <ButtonComponent label="upload" className="bg-[#DEFF5C] " textColor="text-[#575757]"></ButtonComponent></div>
                    <button type="button" onClick={onClose} className="text-xs text-gray-400 uppercase">Cancel</button>
                </form>
            </div>
        </div>





}

export default UploadForm