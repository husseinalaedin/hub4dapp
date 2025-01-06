import { ActionIcon, Box, Button, Drawer, Group } from "@mantine/core";
import { IconArrowLeft, IconHelp, IconX } from "@tabler/icons-react";
import { useState } from "react";

export const HelpPopUp = ({ children }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button
        variant="light"
        onClick={(val) => {
          // refresh()
          setOpened(true);
        }}
      >
        <IconHelp />
      </Button>
      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        size="xl"
        justify="right"
        withCloseButton={false}
      >
        {/* <div className='acc-close-icon-pos'>
                    <ActionIcon onClick={() => {
                        
                        setOpened(false);
                    }}>
                        {<IconArrowLeft size={30} />}
                    </ActionIcon>
                </div> */}
        <Group m="md" justify="right">
          <Button
            c="red"
            color="red"
            variant="default"
            onClick={(val) => {
              // refresh()
              setOpened(false);
            }}
          >
            <IconX />
          </Button>
          {/* <ActionIcon onClick={() => {

                    setOpened(false);
                }}>
                    {<IconX size={30} />}
                </ActionIcon> */}
        </Group>

        <Box sx={{ width: "100%" }}>{children}</Box>
      </Drawer>
    </>
  );
};
