import { format, formatDistance, formatRelative, subDays, eachDayOfInterval } from 'date-fns'
import { enGB, es, enAU, pt, fr, de } from 'date-fns/locale'
import { Local } from './Misc'


const locales = { enGB, es, enAU, pt, fr, de }

export const Format = (date, formatStr = 'PP') => {
    return format(date, formatStr, {
        locale: locales[Local()]
    })
}
export const FormatDistance = (date1, date2) => {
    return formatDistance(date1, date2, { addSuffix: true, locale: locales[Local()] })
}

export class D {
    static local_id(){
        return Local()
    }
    static utc_to_local(utc: any, formatStr = 'PP') {
        try {
            const date = new Date(utc)
            return Format(date, formatStr)
        } catch (error) {

        }
        return ''
    }
    static local_to_utc(local: Date, formatStr = 'PP') {
        try {
            if(!local)
                return ''
            const date = new Date(local)
           
            const utcTime = date.toLocaleString(D.local_id(), { timeZone: 'UTC' });
            let dt= new Date(utcTime)
            let frmt=Format(dt, formatStr)
            return frmt
        } catch (error) {

        }
        return ''
    }
    static local_to_utc_d(local: Date):Date|null {
        try {
            let localD=new Date(local)
            const utcTime = localD.toLocaleString(D.local_id(), { timeZone: 'UTC' });
            return new Date(utcTime)
        } catch (error) {

        }
        return null
    }
    static utc_to_local_with_time(utc: any, formatStr = 'PP') {
        try {
            const date = new Date(utc)
            let frm_dt = Format(date, formatStr)
            let frm_tm = Format(date, 'p')
            return frm_dt+' '+frm_tm
        } catch (error) {

        }
        return ''
    }
    static utc_to_distance(utc: any, ifnull?,ifbig?) {
        if (!utc || utc == '')
            return ifnull
        try {
            const date1 = new Date();
            const date2 = new Date(utc)
            const yearDiff = date2.getFullYear()-date1.getFullYear();
            if(ifbig && yearDiff>10){
                return ifbig
            }
            return FormatDistance(date2, date1)
        } catch (error) {
        }
        return ''
    }
    static utc_to_day(utc: any, ifnull?) {
        if (!utc || utc == '')
            return ifnull
        try {
            const date = new Date(utc)
            return {
                day: date.getDay(),
                day_name: Format(date, 'EEEE'),
                day_name_abr: Format(date, 'EEEEE'),

            }
        } catch (error) {
        }
        return {
            day: '',
            day_name: ''
        }
    }
    static add_days_to_data = (data, dy) => {
        if (data)
            data.map((datum) => {
                if (datum[dy] != '') {
                    let dy_nm = D.utc_to_day(datum[dy]);
                    if (!dy_nm) {
                        console.log(datum)
                    }
                    else {
                        datum['day'] = dy_nm.day;
                        let day_name = dy_nm.day_name
                        day_name = day_name.charAt(0).toUpperCase() + day_name.slice(1).toLowerCase()
                        datum['day_name'] = day_name
                    }

                }
                else {
                    console.log(datum)
                }

            })
        return data
    }
    static get_days_abrev = (): any => {
        const weekStart: any = new Date(2023, 3, 23); // Monday, April 24, 2023
        const weekEnd: any = new Date(2023, 3, 29); // Sunday, April 30, 2023
        let abbrDays: any = [];
        const daysOfWeek = eachDayOfInterval({
            start: weekStart,
            end: weekEnd
        }).map(day => abbrDays.push(Format(day, 'eeeee').toUpperCase()));
        return abbrDays
    }
    static get_months_abrev = (): any => {
        let abbrMonths: any = []
        for (let i = 0; i < 12; i++) {
            const month = new Date(2000, i, 1);
            let abr = Format(month, 'MMM')
            abr = abr.charAt(0).toUpperCase() + abr.slice(1).toLowerCase()
            abbrMonths.push(abr);
        }
        return abbrMonths
    }

    // static utc_to_day(date: Date, ifnull?) {
    //     if (!utc || utc == '')
    //         return ifnull
    //     try {
    //         return {
    //             day: date.getDay(),
    //             day_name: format(date, 'EEEE')
    //         }
    //     } catch (error) {
    //     }
    //     return {
    //         day: '',
    //         day_name: ''
    //     }
    // }
}
  