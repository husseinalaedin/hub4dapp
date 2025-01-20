import { useMantineTheme } from "@mantine/core";
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconInfoCircleFilled,
} from "@tabler/icons-react";

import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

import { nanoid } from "nanoid";

export class G {
  static NB_READ_WORD_PR_SEC = 60 / 70; //70 word per minute then converted to per sec
  static delay(message) {
    if (!message) return 5000;
    let msg: string = message;
    let nb_wrd = msg.split(" ").length;
    let dly = nb_wrd * this.NB_READ_WORD_PR_SEC * 1000;

    return dly < 5000 ? 5000 : dly;
  }
  static buildParamsFromForm(form: any) {
    let params: any = [];
    Object.keys(form.values).map((key) => {
      let val = form.values[key];
      if (val && val != "") {
        let v = [key, val];
        params.push(v);
      }
    });
    return params;
  }
  static updateParamsFromForm(searchParams, form: any) {
    let params: any = [];
    Object.keys(form.values).map((key) => {
      let val = form.values[key];
      if ((val && val != "") || val === 0) {
        searchParams.set(key, val);
      } else searchParams.delete(key);
    });
    return params;
  }
  static updateFromParams(searchParams, form: any) {
    let params: any = [];
    Object.keys(form.values).map((key) => {
      let val = form.values[key];
      if (val && val != "") {
        searchParams.set(key, val);
      } else searchParams.delete(key);
    });
    return params;
  }
  static ifNull(val, ifnul) {
    return val ? val : ifnul;
  }
  static ifNullFromat(val, format, ifnul) {
    return val ? format.replace("%", val) : ifnul;
  }
  static anyToArr(val) {
    if (val && val != "") return val.split(",");
    return [];
  }
  static clearForm(form: any) {
    Object.keys(form.values).map((key) => {
      let newval = {};
      newval[key] = "";
      form.setValues(newval);
    });
  }
  static getUID() {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const uniqueID = parseInt(`${timestamp}${randomNumber}`, 10);
    // console.log('UID', uniqueID)
    return uniqueID;
  }
  static extract_numbers(value) {
    if (!value) return null;
    const numbersArray = value.match(/[0-9]*\.?[0-9]+/g);
    return numbersArray ? numbersArray.map(Number) : null;
  }
  static replace_all(string, search, replace) {
    return string.split(search).join(replace);
  }
  static replace_all_arr(string, search, replace) {
    if (search.length > 0)
      for (let i = 0; i < search.length; i++)
        string = string.split(search[i]).join(replace);
    return string;
  }
  static form_cell_whats(cell) {
    let c = this.replace_all(cell, "+", "");
    c = this.replace_all(cell, " ", "");
    c = this.replace_all(cell, "-", "");
    return c;
  }
  static grid({ small, medium, large, xlarge, s, m, l, xl, o }) {
    if (small) return s;
    if (medium) return m;
    if (large) return l;
    if (xlarge) return xl;
    return o;
  }
  static scroll_to_top() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  static scroll_to_bottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    document.body.scrollTop = document.body.scrollHeight;
  }
  static format_dash(val) {
    return !val || val == "" ? "-" : val;
  }
  static gmail() {
    this.open_tab(
      "https://mail.google.com/mail/u/0/#inbox?compose=new",
      "gmail"
    );
    // window.open(, "_blank");
  }
  static open_tab(url, tabName) {
    var existingTab = window.open("", tabName);
    if (existingTab) {
      existingTab.focus();
      existingTab.location.href = url;
    } else {
      window.open(url, tabName);
    }
  }
  static uid(prefix) {
    let short = nanoid(10);
    return prefix + short; // //tms.toString(32)
  }
  static parseNumberAndString(input) {
    if(!input){
      return{
         number:'', text:'' 
      }
    }
    const match = input.match(/^([\d,]+(\.\d+)?)(.*)$/);
    if (match) {
      const number = parseFloat(match[1].replace(/,/g, "")); // Parse the number after removing commas
      const text = match[3].trim(); // Extract and trim the remaining string
      return { number: number.toString(), text };
    }
    return { number: "", text: input.trim() }; // Handle case when no number is found
  }
}

export const API_URL = "http://localhost:1000/"; // process.env.REACT_APP_API_URL
export const APP_URL = "http://localhost:5173/"; //process.env.REACT_APP_URL

export const PORTAL_URL = "http://localhost:3000/"; //process.env.REACT_APP_URL

export const CLOUDFARE_IMAGE_URL1 = `https://imagedelivery.net/1yS6CCx9XkJ-Y7IxgnLbww/`;
export const BUILD_API = (url) => {
  return API_URL + url;
};
export const BUILD_URL = (url) => {
  return APP_URL + url;
};
export const BUILD_PORTAL_URL = (url) => {
  return PORTAL_URL + url;
};
export const useMessage = () => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const theme_2 = useMantineTheme();

  const error = (errorMsg) => {
    notifications.show({
      id: "notify_failed" + new Date().getTime().toString(),
      autoClose: G.delay(errorMsg),
      title: t("post_failed", "Failed!."),
      message: errorMsg,
      color: "red",
      loading: false,
      icon: <IconX />,
    });
  };
  const warning = (worningMsg) => {
    notifications.show({
      id: "notify_worning" + new Date().getTime().toString(),
      autoClose: G.delay(worningMsg),
      title: t("post_worning", "Warning!."),
      message: worningMsg,
      color: "yellow",
      icon: <IconAlertCircle />,
      loading: false,
    });
  };
  const succeed = (succeededMsg) => {
    notifications.show({
      id: "notify_succ" + new Date().getTime().toString(),
      autoClose: G.delay(succeededMsg),
      title: t("post_succ", "Succeeded!."),
      message: succeededMsg,
      color: theme_2.primaryColor,
      icon: <IconCheck />,
      loading: false,
    });
  };
  const info = (infoMsg) => {
    notifications.show({
      id: "notify_info" + new Date().getTime().toString(),
      autoClose: G.delay(infoMsg),
      title: t("post_info", "Information!."),
      message: infoMsg,
      color: theme_2.primaryColor,
      icon: <IconInfoCircleFilled />,
      loading: false,
    });
  };
  return { error, succeed, warning, info };
};

export class IP {
  static async get_ip() {
    let agent_ip = localStorage.getItem("agent_ip");
    if (agent_ip && agent_ip != "") {
      let agent_ip_o_s = JSON.parse(agent_ip);
      if (new Date().getTime() - agent_ip_o_s.stm <= 1000 * 60 * 60 * 4)
        //checked ip every 4 hours
        return agent_ip_o_s.ip;
    }
    let ip: string = await this.get_ip64();
    if (ip && ip != "noip") return ip;
    try {
      const response = await this.fetchWithTimeout(
        "https://api.ipify.org/?format=json",
        {
          timeout: 1000,
        }
      );
      const data = await response.json();
      let ip = "";
      if (data && data.ip != "") {
        ip = data.ip;
        let agent_ip_o = { ip: ip, stm: new Date().getTime() };
        localStorage.setItem("agent_ip", JSON.stringify(agent_ip_o));
      }
      return ip;
    } catch (error: any) {
      // Timeouts if the request takes
      // longer than 6 seconds
      console.log(error.name === "AbortError");
    }
  }
  static async get_ip64() {
    try {
      const response = await this.fetchWithTimeout(
        "https://api64.ipify.org/?format=json",
        {
          timeout: 2000,
        }
      );
      const data = await response.json();
      let ip = "";
      if (data && data.ip != "") {
        ip = data.ip;
        let agent_ip_o = { ip: ip, stm: new Date().getTime() };
        localStorage.setItem("agent_ip", JSON.stringify(agent_ip_o));
      }
      return ip;
    } catch (error: any) {
      // Timeouts if the request takes
      // longer than 6 seconds
      console.log(error.name === "AbortError");
    }
    return "";
  }
  static async fetchWithTimeout(resource, options) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);

    return response;
  }
}

export class HIST {
  static add(val, co) {
    let histArr: any = this.history;
    for (let i = 0; i < histArr.length; i++) {
      if (histArr[i]["val"] == val) {
        histArr[i]["nb"] = +histArr[i]["nb"] + 1;
        localStorage.setItem("HIST", JSON.stringify(histArr));
        return;
      }
    }
    histArr.unshift({
      // key: key,
      val: val,
      co: co,
      created_on: new Date(),
      nb: 1,
    });
    if (histArr.length >= 10) {
      histArr.pop();
    }
    localStorage.setItem("HIST", JSON.stringify(histArr));
  }
  static get history() {
    let histArr: any = [];
    let hist: any = localStorage.getItem("HIST");
    if (hist && hist != "") {
      try {
        histArr = JSON.parse(hist);
      } catch (error) {}
    }
    return histArr;
  }
  static clear() {
    localStorage.removeItem("HIST");
  }
}
