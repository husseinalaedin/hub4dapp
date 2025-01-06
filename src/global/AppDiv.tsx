import { useGlobalStyl } from "../hooks/useTheme";
import { G } from "./G";

export const AppDiv = ({ contRef, html }) => {
    const { classes: classesG } = useGlobalStyl();
    const tbl = (cont) => {
        return cont
        cont = G.replace_all(cont, '<div></div>', '<div></br></div>')
        return cont
        // return `<table align="center" valign="top"><tr><td>${cont}</td></tr></table>`
    }
    return (
        <div ref={contRef} className={`${classesG.appDiv} parent-div`} dangerouslySetInnerHTML={{ __html: tbl(html) }} style={{ whiteSpace: "normal", margin: "auto",textAlign:"justify" }}>
        </div>
    )
}