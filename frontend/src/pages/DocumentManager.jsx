import SideMenuComponent from "../components/SideMenuComponent"
import DocumentComponent from "../components/DocumentComponent";
import FormField from "../components/FormField";
import React, { useState } from "react";
import ButtonComponent from "../components/ButtonComponent";

function DocumentManager(){

    const [searchText, setSearchText] = useState("")

    const dummyDoc = {
        id: 1,
        title: "Diplomski_Rad_Final.pdf",
        doc_type: "PDF",
        tags: ["faks", "draft", "bitno"],
        created_at: "2026-02-07T16:40:00Z"
    };

    const handleEdit = (id) => console.log("Editujem dokument:", id);
    const handleDelete = (id) => alert("Da li ste sigurni da želite da obrišete dokument " + id + "?");

    return <div className="flex min-h-screen">
        {/*glavni sadrzaj stranice */}
        <main className="flex-1 flex flex-col">
            <div className="flex items-center gap-12 px-12 py-8">
                <h1>Knowledge Base</h1>
                <FormField type="text" placeholder="search" value={searchText} onChange={(e)=>setSearchText(e.target.value)} ></FormField>
                <select className="w-36 h-12 border border-gray-300 ">
                    <option>Filter 1</option>
                </select>
                <select className="w-36 h-12 border border-gray-300 ">
                    <option>Filter 2</option>
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