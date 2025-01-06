// firstChild.tsx

import { useState } from "react";

interface IfirstChildProps {
    name: string

}

const FirstChild: React.FC<IfirstChildProps> = ({ name }) => {

    const [firstChildName, setFirstChildName] = useState<string>('')

    return (

        <section>
            <h1> {firstChildName} </h1>
            <button> first child </button>
        </section>

    )

}

export default FirstChild;