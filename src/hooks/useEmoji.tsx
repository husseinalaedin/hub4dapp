import { IconBallBaseball, IconBulb, IconCar, IconCat, IconCheese, IconFlag, IconMoodSmile, IconPercentage } from "@tabler/icons-react"
import { useCallback, useEffect, useState } from "react"
import emoji from "unicode-emoji-json"
import debounce from 'lodash.debounce';
export const useEmoji = ({ t }) => {
    // let smileys = t('smileys', 'Smileys & Emotion')
    let people = t('people', 'People')
    let animals = t('animals', 'Animals & Nature')
    let food = t('food', 'Food & Drink')
    let travel = t('travel', 'Travel & Places')
    let activities = t('activities', 'Activities')
    let objects = t('objects', 'Objects')
    let symbols = t('symbols', 'Symbols')
    let flags = t('flags', 'Flags')
    const [emojiAllGroups, setEmojiAllGroups] = useState<any>({})
    const [emojiGroups, setEmojiGroups] = useState<any>({})
    useEffect(() => {
        search_('', true)
    }, [])
    const search_ = (val, init) => {
        let lcl_grp: any = {}
        lcl_grp['People'] = { group: people, icon_group: <IconMoodSmile /> }
        // lcl_grp['People & Body'] = { group: people }
        lcl_grp['Animals & Nature'] = { group: animals, icon_group: <IconCat /> }
        lcl_grp['Food & Drink'] = { group: food, icon_group: <IconCheese /> }
        lcl_grp['Travel & Places'] = { group: travel, icon_group: <IconCar /> }
        lcl_grp['Activities'] = { group: activities, icon_group: <IconBallBaseball /> }
        lcl_grp['Objects'] = { group: objects, icon_group: <IconBulb /> }
        lcl_grp['Symbols'] = { group: symbols, icon_group: <IconPercentage /> }
        lcl_grp['Flags'] = { group: flags, icon_group: <IconFlag /> }

        let emojii = emoji
        Object.keys(emojii).forEach(key => {
            const emoji = emojii[key];
            if (val != '' && !emoji.name.includes(val)) {
                return
            }

            let group = emoji.group || 'Objects';
            if (group == 'People & Body' || group == 'Smileys & Emotion') {
                group = 'People'
            }
            if (!lcl_grp[group]) {
                group = 'Objects'
            }
            if (!lcl_grp[group]['emojis'])
                lcl_grp[group]['emojis'] = []
            lcl_grp[group]['emojis'].push({ emoji: key, name: emoji.name });
        });
        let searched_lcl_grp: any = {}
        Object.keys(lcl_grp).forEach(group => {
            if (!(!lcl_grp[group]['emojis'] || !lcl_grp[group]['emojis'].length || lcl_grp[group]['emojis'].length <= 0)) {
                searched_lcl_grp[group] = lcl_grp[group]
            }
        })
        setEmojiGroups(searched_lcl_grp)
        if (init) {
            setEmojiAllGroups(lcl_grp)
        }
    }
    // const search0 = (val) => {
    //     search_(val, false)
    // }
    const search = debounce((val) => search_(val,false), 150)
    // const search=(val)=>{
    //     search_(val, false)
    // }
    return { emojiGroups: emojiGroups, search, emojiAllGroups  }
}