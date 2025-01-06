import { Box, Card } from "@mantine/core"
import { useEffect, useRef, useState } from "react";

export const CardIn = ({ children, classesG, ...others }) => {
    const cardRef = useRef<any>(null);
    const [isIn, setIsIn] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false)
    let clss = isIn ? classesG.cardSelected : (selected ? classesG.cardHover : '')
    if (others && others.classNameForce && others.classNameForce != '') {
        clss = others.classNameForce
    }
    useEffect(()=>{
        setSelected(others?.isSelected)
    }, [others?.isSelected])
 
    return (
        <Card
            
            {...others}
            ref={cardRef}
            className={clss}

            onMouseEnter={() => {
                setIsIn(true)
                if (others && others.OnInOut) {
                    others.OnInOut(true)
                }
            }}
            onMouseLeave={() => {
                setIsIn(false)
                if (others && others.OnInOut) {
                    others.OnInOut(false)
                }
            }}
            onClick={(e) => {
                if (others.onSelected) {
                    others.onSelected()
                }
            }}
        >
            {children}
        </Card>

    )
}