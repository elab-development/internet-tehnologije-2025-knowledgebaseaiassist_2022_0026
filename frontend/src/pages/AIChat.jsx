import SideMenuComponent from "../components/SideMenuComponent"
import FormField from "../components/FormField"
import { useState, useEffect } from "react"
import api from "../api"

function AIChat(){

    const [messages, setMessages] = useState([]) // question, answer, sources, tek kad se klikne save ide u bayu, do tad je samo u ovoj kuki
    const [inputText, setInputText] = useState("")
    const [sending, setSending] = useState(false)
    const [conversations, setConversations] = useState([]) // sacuvane konverzacije
    const [conversationId, setConversationId] = useState(null) // ova konverzacija, vrednost je null dok se ne klikne save, tek kad se sacuva u bazi dobija id

    const getConversations = async () => { // dobija sve sacuvane konverzacije is relacione baze
        try {
            const response = await api.get("/api/conversation/new/")
            setConversations(response.data)
        } catch (error) {
            console.error("Error loading conversations:", error)
        }
    }

    useEffect(() => {
        getConversations()
    }, [])

    // na send message
    const handleSend = async () => {
        if(!inputText.trim() || sending) return // ako nista nije ukucano ili se nesto vec salje

        const question = inputText
        setInputText("")
        setSending(true)

        try {
            const response = await api.post("/api/chat/ask/", {
                question,
                conversation_id: conversationId // null dok se ne sacuva konv
            })
            setMessages(prev => [...prev, {// poruka nova sa odgovorom se dodaje u listu
                question,
                answer: response.data.answer,
                sources: response.data.sources
            }])
        } catch (error) {
            alert("Greska pri slanju poruke.")
        } finally {
            setSending(false)
        }
    }

    const handleNewChat = () => {
        setMessages([])
        setConversationId(null)
        setInputText("")
    }
    const handleLoadConversation = (conv) => { 
        setMessages(conv.conversationContent || [])
        setConversationId(conv.id)
    }

    // salje ceo dosadasnji razgovor odjednom, ne samo od trenutka klika
    const handleSaveConversation = async () => {
        if(messages.length === 0) return
        const name = window.prompt("Naziv konverzacije:", messages[0]?.question?.slice(0, 20) || "New convo") // naziv se bira
        if(!name) return

        try {
            const response = await api.post("/api/conversation/new/", { // add convo, sad dobijamo i id
                name,
                conversationContent: messages, // ceo niz poruka do sad
                isSaved: true
            })
            setConversationId(response.data.id) // od sad se svaka nova poruka automatski upisuje u ovu konverzaciju preko chatview, jer id nije null
            getConversations()
        } catch (error) {
            alert("Cuvanje konverzacije nije uspelo.")
        }
    }

    const handleUnsaveConversation = async () => {
        if(messages.length === 0) return
        if(conversationId === null) return

        try {
            const response = await api.delete(`/api/conversation/delete/${conversationId}/`,  // brisemo prethodno sacuvan kombo iz baze
                )
            setConversationId(null) // vraca se na null vrednost ida, moguce je opet sacuvati
            getConversations()
        } catch (error) {
            alert("Ukidanje cuvanja konverzacije nije uspelo.")
        }
    }

    return <div className="overflow-hidden">
        <main className="flex-1 flex ml-18 mr-18 h-screen ">
            {/* saved chats deo */}
            <div className="flex flex-col w-48 h-full bg-[#575757]">
                <h1 className="flex text-7xl font-dots text-white pt-8 pb-8">saved</h1>
                {conversations.map(conv => ( // dodajemo sacuvane konverzacije u listu saved chats
                    <button
                        key={conv.id}
                        onClick={() => handleLoadConversation(conv)} // na klik se otvara ta konverzacija
                        className={`flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95 ${conversationId === conv.id ? "border-2 border-[#DEFF5C]" : ""}`}
                        type="button"
                    >
                        {conv.name}
                    </button>
                ))}
                <button
                    onClick={handleNewChat} // na klik novi chat
                    className="fixed bottom-12 h-12 z-10 pointer-events-auto w-48 text-white cursor-pointer hover:bg-[#DEFF5C] hover:text-black duration-200 hover:underline transition-all active:scale-95"
                    type="button"
                > + new chat </button>
            </div>

            {/* konverzacija deo */}
            <div className="flex flex-col flex-1 p-12 pt-8 relative">
                <div className="flex items-center justify-between">
                    <h1 className="flex text-7xl font-dots">Your Assistant</h1>
                    {conversationId === null && messages.length > 0 && (
                        
                        <button
                            onClick={handleSaveConversation}
                            className="hover:outline-1 hover:text-black duration-100  transition-all active:scale-95  h-12 w-12  outline-[#DEFF5C] rounded-xl"
                        >
                            save
                        </button>
                    )}
                    {conversationId !== null && messages.length > 0 && (
                        <button
                            onClick={handleUnsaveConversation}
                            className=" hover:text-black  bg-[#DEFF5C] duration-100  transition-all active:scale-95 h-12 w-12   rounded-xl"
                        >
                            saved
                            
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-6 flex-1 overflow-y-auto no-scrollbar pb-6 pt-3">
                    {messages.map((msg, i) => (
                        <div key={i} className="flex flex-col gap-2  pr-3">
                            <div className="relative self-end inline-block max-w-2/3">
                                <div className="absolute inset-0 bg-[#E7E7E7] blur-sm rounded-xl pointer-events-none"></div>
                                <div className="relative z-10 px-4 py-2 rounded-xl">
                                     {msg.question}
                                 </div>
                            </div>
                            <div className="self-start px-4 py-2 rounded-xl max-w-2/3 pb-3">
                                {msg.answer}
                                {msg.sources?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 italic">
                                        {[...new Map(msg.sources.map(s => [s.document_id, s])).values()].map((s, j) => (
                                            <span key={j} className="py-1 rounded-full">
                                                 /{s.document_title}kk/ 
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {sending && <p className="text-[#575757] text-sm">Assistant is thinking...</p>}
                </div>

                <div className="absolute bottom-12 right-30 flex gap-4">
                    <FormField
                        type="text"
                        placeholder="Ask your assistant..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex w-220"
                    />
                    
                </div>
                <button
                        onClick={handleSend}
                        disabled={sending}
                        className=" self-end h-12 w-12  bg-[#DEFF5C] text-[#575757] text-xl hover:blur-xs cursor-pointer rounded-2xl"
                    >
                    ˄
                    </button>
            </div>
        </main>
        <SideMenuComponent navigateTo="/" label="home" side="left"></SideMenuComponent>
        <SideMenuComponent navigateTo="/document_manager" label="document manager" side="right"></SideMenuComponent>
    </div>
}

export default AIChat