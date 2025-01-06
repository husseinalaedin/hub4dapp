import { useState } from "react"

export const useBValue = ( val0 ) => {
    const [current, setCurrent] = useState(val0)
    const [saved, setSaved] = useState(val0)
    const cancel = () => {
        setCurrent(saved)
    }
    const save = () => {
        setSaved(current)
    }
    const change = (val) => {
        setCurrent(val)
    }
    return { current, save, change, cancel, setCurrent }
}
