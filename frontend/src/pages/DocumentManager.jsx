import SideMenuComponent from "../components/SideMenuComponent"
import DocumentComponent from "../components/DocumentComponent";
import FormField from "../components/FormField";
import React, { useState } from "react";
import ButtonComponent from "../components/ButtonComponent";
import UploadForm from "../components/UploadForm";

function DocumentManager(){

    const [searchText, setSearchText] = useState("")
    const [documents, setDocuments] = useState([])
    const [uploadFormOpen, setUploadFormOpen] = useState(false)

    // const getDocument() =>{}


    const dummyDoc = {
        id: 1,
        title: "Diplomski_Rad_Final.pdf",
        doc_type: "PDF",
        tags: ["faks", "draft", "bitno"],
        created_at: "2026-02-07T16:40:00Z"
    };

    const handleEdit = (id) => alert("editing document:", id);
    const handleDelete = (id) => alert("Are you sure you want to delete document " + id + "?");



    return <div className="flex min-h-screen">
        {/*glavni sadrzaj stranice */}
        <main className="flex-1 flex flex-col ml-18 mr-18">
            <div className="flex w-full bg-blue items-center gap-12 p-12 pt-8">
                <h1 className="text-7xl font-dots leading-none">Knowledge Base</h1>
                <FormField type="text" placeholder="search" value={searchText} onChange={(e)=>setSearchText(e.target.value)} ></FormField>
                <select className="w-36 h-12 border border-gray-300 bg-[#575757] text-white drop-shadow-md text-right pr-4">
                    <option>filter tags</option>
                </select>
                <select className="w-36 h-12 border border-gray-300 bg-[#575757] text-white drop-shadow-md text-right pr-4">
                    <option>filter file type</option>
                </select>
            </div>

            <div className="px-12 flex flex-col">
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                <DocumentComponent doc={dummyDoc} onEdit={handleEdit} onDelete={handleDelete} />
                {/* Možeš dodati još DocumentCard komponenti ovde */}
            </div>

            <UploadForm isOpen={uploadFormOpen} onClose={()=>setUploadFormOpen(false)}></UploadForm>

            <div className="fixed bottom-12  self-center items-center z-50"
                onClick={()=> setUploadFormOpen(true)}>
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