import SideMenuComponent from "../components/SideMenuComponent"

function AIChat(){
    return <div>ai chat

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