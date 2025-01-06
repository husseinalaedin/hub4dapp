import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSettingLocal } from "../global/Misc";
import { change_language } from "../store/features/CurrentSettings";

export const useChangeLanguage = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation('public');
    const changeLang = (value: string) => {
        i18n.changeLanguage(value);
        // localStorage.setItem("i18nextLng", value);
        setSettingLocal('lang', value)
        dispatch(change_language(value))
    }
    return { changeLang }
}
export const useChangeLocal=()=>{
    const changeLocal = (value: string) => {
        
        localStorage.setItem("local", value);
       return setSettingLocal('local', value)
    }
    return { changeLocal }
}