import { Button, Menu } from "@mantine/core";
import { IconGripVertical, IconSquare, IconSquareCheck } from "@tabler/icons-react";

export const useSelection=({data,setData,fieldID})=>{
    const select = (objectId) => {
        const newData = [...data];
        const updatedObjectIndex = newData.findIndex(obj => obj[fieldID] === objectId)
        if (updatedObjectIndex !== -1) {
            const updatedObject = { ...newData[updatedObjectIndex] };
            updatedObject['isSelected'] = !updatedObject['isSelected'];
            newData[updatedObjectIndex] = updatedObject;
            setData(newData);
        }
    }
    const selectAll = (isSelected) => {
        const newData = [...data];
        newData.map((obj) => {
            obj['isSelected'] = isSelected
        })
        setData(newData);
    }
    const isAnySelected=()=>{
        for(let i=0;i<data?.length;i++)
            if (data[i]['isSelected'])
                return true
        return false
    }
    const isAllSelected = () => {
        for (let i = 0; i < data?.length; i++)
            if (!data[i]['isSelected'])
                return false
        return true
    }
    const selectedIds = () => {
        let slectedids:any=[]
        for (let i = 0; i < data?.length; i++)
            if (data[i]['isSelected'])
                slectedids.push(data[i][fieldID])
        return slectedids
    }
    return { select, selectAll, isAnySelected, selectedIds, isAllSelected }
}

export const selectMenu = ({ t,selectAll })=>
    (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button pr="5px" pl="5px" color="dark.4" variant="default" m={0} radius={0} >
                    <IconGripVertical size={20} />
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>{t('share', 'Share')}</Menu.Label>
                <Menu.Item onClick={() => {
                    selectAll(true)
                }} icon={<IconSquareCheck size={16} />}>{t('select_all', 'Select all')}</Menu.Item>
                <Menu.Item onClick={() => {
                    selectAll(false)
                }} icon={<IconSquare size={16} />}>{t('unselect_all', 'Unselect all')}</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )