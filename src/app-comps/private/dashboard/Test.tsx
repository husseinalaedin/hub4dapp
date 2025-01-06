 
import { useEffect, useState } from 'react';
import { useAppTheme } from '../../../hooks/useAppTheme';

// echarts.registerTheme('dark0', dark.theme);
// echarts.registerTheme('dim', dim.theme);

export const Test = () => {
    let [thm, setTm] = useState<any>('dark0')
    let { theme } = useAppTheme();

    useEffect(() => {
        setTm(() => {
            return theme == "dark" ? 'dim' : (theme == "dim" ? 'dark0' : null)
        })
    }, [theme])
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    };
    return (<>
        {/* <ReactECharts option={option} theme={thm} /> */}
    </>)
}

