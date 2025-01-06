import { BRANDS } from "./IconBrands";

export const userDataInit = () => {
    const isClient = typeof window !== "undefined";

    if (!isClient) return {};
         let usrdta = localStorage.getItem("userData");
    if (usrdta && usrdta != '')
        return JSON.parse(usrdta)
    return {}
}
export const initLang = () => {
    let lang = userDataInit()['lang']
    if (lang && lang != "")
        return lang;
    return 'en'
}
export const initTheme = () => {
    let theme = userDataInit()['theme']
    if (theme && theme != "")
        return theme;
    return 'light'
}
export const isOwner=()=>{
    let co_owner = userDataInit()["co_owner"];
    if (co_owner && co_owner != "") return co_owner == "X";
    return false
}
export const NumbSep = () => {
    return NumbSep2()
}
export const NumbSep2 = () => {
    let local = Local();
    let numbr = 1234567.89
    let formt = new Intl.NumberFormat(local).format(numbr).replace(/\d+/g, '');
    return [formt[formt.length - 2], formt[formt.length - 1]]
}
export const Local = () => {
    
    // let local = userDataInit()['local']
    // if (local && local != "")
    //     return local
    let local = localStorage.getItem('local');
    if(local&& local!='')
        return local
    return 'en-US'
}
// export const InitNumbSep = () => {
//     let s = "";
//     s.substring(0, 1)
//     let numb_sep = userDataInit()['numb_sep']
//     if (numb_sep && numb_sep != "")
//         return numb_sep
//     return ',.'
// }
export const setSettingLocal = (key: any, value: any) => {
  let userData = userDataInit();
  userData[key] = value;
  localStorage.setItem("userData", JSON.stringify(userData));
  return userData;
};
export const thousandSep = () => {
    let tsnd = NumbSep()[0]
    return tsnd
}
export const decimalSep = () => {
    let dcml = NumbSep()[1]
    return dcml
}
export const openWhatsappAsWeb = () => {
    let numb_sep = userDataInit()['openwhatsapp_as_web']
    return numb_sep == 'X'
}
export const opengroupurl = (isPhone: any, channel_group_id: any, url: any) => {
  if (channel_group_id == "WATS_APP") {
    if (!isPhone() && openWhatsappAsWeb()) {
      url = "https://web.whatsapp.com";
    } else url = "whatsapp://";
  }
  window.open(url, channel_group_id);
};
export const openChannel = (isPhone: any, channel: any, open: any) => {
  let url_ret = "";
  if (!channel) return "";
  let url = channel.channel_data;
  if (channel.channel_group_id == BRANDS.WATS_APP) {
    if (!isPhone() && openWhatsappAsWeb()) {
      url = "https://web.whatsapp.com";
    } else url = "whatsapp://";
  }
  if (open && url != "" && channel.channel_group_id != BRANDS.EMAIL) {
    url_ret = url;
    window.open(url, channel.channel_group_id);
  }

  return url_ret;
};

export const hiddenProfile = () => {
    let hidden = userDataInit()['hidden']
    if (hidden && hidden != "")
        return hidden;
    return hidden == 'X'
}
export const emailUser = () => {
    let email = userDataInit()['email']
    if (email && email != "")
        return email;
    return ''
}

const GRIDS_DATA_SOURCE = () => {
    let grds = localStorage.getItem('GRIDS');
    if (grds && grds != '')
        return JSON.parse(grds)
    return {}
}
const GRIDS_DATA_SOURCE_SAVE = (GRIDS: any) => {
  localStorage.setItem("GRIDS", JSON.stringify(GRIDS));
};
export const GridLayOut = (grid: any, layout: any, direction: any, default_: any) => {
  let GRIDS = GRIDS_DATA_SOURCE();
  if (direction == "GET") {
    let lyot = GRIDS[grid];
    if (lyot && lyot !== "") return lyot;
    return default_;
  }
  GRIDS[grid] = layout;
  GRIDS_DATA_SOURCE_SAVE(GRIDS);
};

export const shareExpirationPeriodList = ({ t, is_for, expire }: any) => {
  let dta: any = [];
  if (is_for != "settings") {
    dta.push({
      value: -1,
      label: t("expire", "Expire"),
    });
    dta.push({
      value: 0,
      label: is_for === "settings" ? 0 : t("today", "Today"),
    });
  }

  dta.push({
    value: 1,
    label: is_for === "settings" ? 1 : t("tomorrow", "Tomorrow"),
  });
  dta.push({
    value: 2,
    label: 2,
  });
  dta.push({
    value: 5,
    label: 5,
  });
  dta.push({
    value: 7,
    label: 7,
  });
  dta.push({
    value: 10,
    label: 10,
  });
  dta.push({
    value: 20,
    label: 20,
  });

  dta.push({
    value: 30,
    label: 30,
  });
  dta.push({
    value: 45,
    label: 45,
  });
  dta.push({
    value: 60,
    label: 60,
  });
  dta.push({
    value: 90,
    label: 90,
  });
  dta.push({
    value: 10000,
    label: t("never_expired", "Never Expired"),
  });
  const index = dta.findIndex((element: any) => element.value === expire);

  if (index === -1 && expire) {
    const insertIndex = dta.findIndex((element: any) => element.value > expire);
    const newIndex = insertIndex !== -1 ? insertIndex : dta.length;
    dta.splice(newIndex, 0, {
      value: expire,
      label: expire,
    });
  }

  // let found=false
  // for(let i=0;i<dta.length;i++){
  //     if(dta[i].value==expire)
  //         {
  //             found=true
  //             break
  //         }
  // }
  // if(!found){
  //     dta.push({
  //         value: expire,
  //         label: expire
  //     })
  // }
  return dta;
};