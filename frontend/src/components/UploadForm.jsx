import { useState, useEffect } from "react"
import FormField from "./FormField"
import ButtonComponent from "./ButtonComponent"

function UploadForm({isOpen, onClose}){


// cuvamo vrednosti za kasnije eventualno slanje bekendu
const [docTitle,setDocTitle]=useState("")
const [uploadedFile,setUploadedFile]=useState(null)
const [docDescription,setDocDescription]=useState("")
const [tagName,setTagName]=useState("")
const [tagColor,setTagColor]=useState("#DEFF5C")
const [docTags,setDocTags]=useState([])

if(!isOpen)return

const handleSubmit = async (e)=>{}

const onAddTag = async (e)=>{}



return <div className="fixed z-[100] m-12 w-288 h-auto flex items-center self-center justify-center bg-black/60 backdrop-blur-sm  drop-shadow-md ">
            <div className="bg-[#575757]    rounded-2xl w-full  shadow-2xl relative">
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        onChange={(e) => setUploadedFile(e.target.files[0])} // Uzimamo prvi fajl
                        required
                    />

                    <div className="relative">
                    <div className="absolute inset-0 bg-[#E7E7E7] blur-sm pointer-events-none"></div>
                    <textarea 
                        placeholder="description (optional)"
                        className="relative z-10 w-full h-full border-2 border-dotted border-black/10 p-2 h-24 outline-none rounded-lg"
                        onChange={(e) => setDocDescription(e.target.value)}
                    /></div>

                    {/* za tagove */}
                    <div className="flex w-120">
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
                    <button type="button" onClick={onAddTag} className="flex-1 text-xs w-12 h-12 bg-[#DEFF5C]/30 text-white uppercase">add tag</button>
                    </div>

                    <ButtonComponent label="upload" className="bg-[#DEFF5C] " textColor="text-[#575757]"></ButtonComponent>
                    <button type="button" onClick={onClose} className="text-xs text-gray-400 uppercase">Cancel</button>
                </form>
            </div>
        </div>





}

export default UploadForm