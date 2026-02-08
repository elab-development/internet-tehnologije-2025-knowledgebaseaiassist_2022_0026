import SideMenuComponent from "../components/SideMenuComponent"
import FormField from "../components/FormField"

function AIChat(){
    return <div className="overflow-hidden">
        <main className="flex-1 flex  ml-18 mr-18 h-screen ">
            {/* saved chats deo */}
            <div className=" flex flex-col w-48 h-full bg-[#575757]">
                <h1 className="flex text-7xl font-dots text-white pt-8 pb-8">saved</h1>
                <button className="flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto  text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95" type="button"> Good chat 1 </button>
                <button className="flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto   text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95" type="button"> Good chat 1 </button>
                <button className="flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto  text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95" type="button"> Good chat 1 </button>
                <button className="flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto  text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95" type="button"> Good chat 1 </button>
                <button className="flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto   text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95" type="button"> Good chat 1 </button>
                <button className="flex h-9 z-10 relative w-full items-center justify-center pointer-events-auto   text-white cursor-pointer hover:border-white hover:border-2 transition-transform active:scale-95" type="button"> Good chat 1 </button>
                <button className="fixed bottom-12 h-12 z-10   pointer-events-auto  w-48 text-white cursor-pointer hover:bg-[#DEFF5C] hover:text-black duration-200 hover:underline   transition-all active:scale-95" type="button"> + new chat </button>
            </div>


            {/* konverzacija deo */}
            <div className=" flex flex-col  p-12 pt-8">
                <h1 className="flex text-7xl font-dots">Your Assistant</h1>

                {/* bas konverzacija deo */}
                <div className="flex "></div>
                
                <div className="absolute bottom-12 right-30">
                <FormField type="text" placeholder="Ask your assistant..." className="flex w-220 "></FormField>
                </div>

            </div>
            
        </main>
        <SideMenuComponent
            navigateTo="/"
            label = "home"
            side = "left"
        ></SideMenuComponent>
        <SideMenuComponent
            navigateTo="/document_manager"
            label = "document manager"
            side = "right"
        ></SideMenuComponent>
    </div>
}

export default AIChat