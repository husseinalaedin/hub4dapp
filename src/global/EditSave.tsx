import { Button, Group } from "@mantine/core";
import { IconDeviceFloppy, IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { selectOpened, selectSmall } from "../store/features/ScreenStatus";

export const EditSave = ({
  onEdit,
  onSave,
  setEditCompletedFromPrarent,
  initEdit,
}: any) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const opened = useSelector(selectOpened);
  const small = useSelector(selectSmall);

  const [edit, setEdit] = useState(() => {
    return !!initEdit;
  });

  const go_edit = () => {
    setEdit(true);
  };

  useEffect(() => {
    if (onEdit) {
      onEdit(edit);
    }
  }, [edit]);
  const go_save = () => {
    if (onSave) {
      onSave();
    }
  };
  useEffect(() => {
    if (setEditCompletedFromPrarent) setEdit(false);
  }, [setEditCompletedFromPrarent]);
  return (
    <div>
      <Group
        justify="right"
        gap="xs"
        style={{ display: small && opened ? "none" : "" }}
      >
        {!edit && (
          <Button
            leftSection={<IconPencil size={18} />}
            type="button"
            onClick={go_edit}
          >
            {t("edit", "Edit")}
          </Button>
        )}
        {edit && (
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            type="submit"
            onClick={go_save}
          >
            {t("save", "Save")}
          </Button>
        )}
      </Group>
    </div>
  );
};
