import { Box, ThemeIcon } from "@mantine/core"
import {
    IconBrandFacebook, IconBrandGoogle, IconBrandInstagram, IconBrandLinkedin, IconBrandTelegram, IconCircleFilled, IconBrandWhatsapp, IconLink, IconMail, IconBrandYoutube, IconBrandWechat, IconBrandTiktok,
    IconBrandPinterest, IconBrandReddit, IconBrandX
} from "@tabler/icons-react"
export const BRANDS = {
    WATS_APP: 'WATS_APP',
    LINK_IN: 'LINK_IN',
    FB: 'FB',
    INS: 'INS',
    REDT: 'REDT',
    // TWT:'TWT',
    X: 'X',
    EMAIL: 'EMAIL',
    GOGL: 'GOGL',
    TGRM: 'TGRM',
    UTUBE: 'UTUBE',
    WECHT: 'WECHT',
    TKTK: 'TKTK',
    PIN: 'PIN',
    OTHR: 'OTHR',
    DFLT: 'DFLT'
}
export const IconBrands = ({ brand, size }) => {

    return (
        <>
            {BRANDS[brand] == BRANDS.WATS_APP && <IconBrandWhatsapp size={size} />}
            {BRANDS[brand] == BRANDS.LINK_IN && <IconBrandLinkedin size={size} />}
            {BRANDS[brand] == BRANDS.FB && <IconBrandFacebook size={size} />}
            {BRANDS[brand] == BRANDS.REDT && <IconBrandReddit size={size} />}


            {BRANDS[brand] == BRANDS.INS && <IconBrandInstagram size={size} />}
            {/* {BRANDS[brand] == "TWT" && <IconBrandTwitter size={size} />} */}

            {BRANDS[brand] == BRANDS.X && <IconBrandX size={size} />}

            {BRANDS[brand] == BRANDS.GOGL && <IconBrandGoogle size={size} />}
            {BRANDS[brand] == BRANDS.TGRM && <IconBrandTelegram size={size} />}

            {BRANDS[brand] == BRANDS.EMAIL && <IconMail size={size} />}
            {BRANDS[brand] == BRANDS.UTUBE && <IconBrandYoutube size={size} />}

            {BRANDS[brand] == BRANDS.WECHT && <IconBrandWechat size={size} />}
            {BRANDS[brand] == BRANDS.TKTK && <IconBrandTiktok size={size} />}

            {BRANDS[brand] == BRANDS.PIN && <IconBrandPinterest size={size} />}
            {BRANDS[brand] == BRANDS.DFLT && <IconCircleFilled size={size} style={{ color: "#842727" }} />}
            {/* {BRANDS[brand] == BRANDS.DFLT && <ThemeIcon variant="default" c="red">
                <IconCircleFilled size={size} />
            </ThemeIcon>} */}

            {(BRANDS[brand] == BRANDS.OTHR || !BRANDS[brand] || BRANDS[brand] == "") && <IconLink size={size} style={{ color: "red" }} />}
        </>

    )
}