import 'react-phone-number-input/style.css'
import Input from 'react-phone-number-input/input'
import { Select } from "@mantine/core";

import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'
import es from 'react-phone-number-input/locale/es.json'
import pt from 'react-phone-number-input/locale/pt.json'
import fr from 'react-phone-number-input/locale/fr.json'

import de from 'react-phone-number-input/locale/de.json'


import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';  
import { selectLanguage } from '../store/features/CurrentSettings';


// export const CountrySelect = ({ value, onChange, labels, ...rest }) => (
//     <select
//         {...rest}
//         value={value}
//         onChange={event => onChange(event.target.value || undefined)}>
//         <option value="">
//             {labels['ZZ']}
//         </option>
//         {getCountries().map((country) => (
//             <option key={country} value={country}>
//                 {labels[country]} +{getCountryCallingCode(country)}
//             </option>
//         ))}
//     </select>
// )

export const CountrySelectLang = ({ onChange, lang, ...rest }) => {
    const [countries, setCountries] = useState<any>([])
    const [countries2, setCountries2] = useState<any>([])
    // const [url, setUrl] = useState<any>(() => 'react-phone-number-input/locale/' + lang + '.json')

    useEffect(() => {
        try {
            // let url = '/react-phone-number-input/locale/' + lang + '.json'
            switch (lang) {
                case 'es':
                    setCountries(es)
                    break;
                case 'pt':
                    setCountries(pt)
                    break;
                case 'fr':
                    setCountries(fr)
                    break;
                case 'de':
                    setCountries(de)
                    break;
                default:
                    setCountries(en)
                    break;
            }
            // import(url).then(module => setCountries(module.default))
            // await import("./foo.json", { assert: { type: "json" } });

        } catch (error) {

        }

    }, [lang])
    useEffect(() => {
        let countries22: any = []
        getCountries().map((country) => (
            countries22.push({
                key: country,
                name: countries[country],
                code: getCountryCallingCode(country),
                value: country,
                label: country + ' - ' + countries[country]// + ' ' + getCountryCallingCode(country),
            })
        ))
        countries22.sort((a, b) => {
            if (a.name <= b.name)
                return -1
            else
                return 1
        }
        );
        setCountries2(countries22)
    }, [countries])
    return (
        // <select
        //     {...rest}
        //     value={value}
        //     onChange={event => onChange(event.target.value || undefined)}>
        //     <option value="">
        //         {countries['ZZ']}
        //     </option>
        //     {countries2.map((country) => (
        //         <option key={country.key} value={country.key}>
        //             {country.name} +{country.code}
        //         </option>
        //     ))}
        // </select>
        <Select searchable clearable required
            // size="xl"
            // label={t("select_language", 'Select Language')}
            // placeholder={t("select_language", 'Select Language')}
            data={countries2}
        // onChange={lang_changed}
        >
        </Select >
    )
}
export const useCountryCode = () => {
    let [countryCode, setCountryCode] = useState<string>('')
    let [country, setCountry] = useState<any>(() => {
        let cd = navigator?.language
        if (cd != '') {
            let regn = (new Intl.Locale(cd)).region
            if (regn)
                return regn;
        }
        return ''
    })

    // try {
    //     setCountry((new Intl.Locale(navigator.language)).region)

    // } catch (error) {

    // }
    useEffect(() => {
        if (!country)
            return
        setCountryCode(getCountryCallingCode(country))
    }, [country])
    return { countryCode, country };
}

export const useLangCountries = () => {
    const lang = useSelector(selectLanguage);
    const [countries, setCountries] = useState<any>([])
    const [localCountries, setLocalCountries] = useState<any>([])
    // const [url, setUrl] = useState<any>(() => 'react-phone-number-input/locale/' + lang + '.json')

    useEffect(() => {
        try {
            // let url = '/react-phone-number-input/locale/' + lang + '.json'
            switch (lang) {
                case 'es':
                    setLocalCountries(es)
                    break;
                case 'pt':
                    setLocalCountries(pt)
                    break;
                case 'fr':
                    setLocalCountries(fr)
                    break;
                case 'de':
                    setLocalCountries(de)
                    break;
                default:
                    setLocalCountries(en)
                    break;
            }

        } catch (error) {

        }

    }, [lang])
    useEffect(() => {
        let countries_var: any = []
        getCountries().map((country) => (
            countries_var.push({
                key: country,
                name: localCountries[country],
                code: getCountryCallingCode(country),
                value: country,
                label: country + ' - ' + localCountries[country]// + ' ' + getCountryCallingCode(country),
            })
        ))
        countries_var.sort((a, b) => {
            if (a.name <= b.name)
                return -1
            else
                return 1
        }
        );
        setCountries(countries_var)
    }, [localCountries])
    return { countries }
}