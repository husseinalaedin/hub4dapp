import { Button, Group } from "@mantine/core";
import {
  IconDeviceFloppy,
  IconEditCircle,
  IconPencil,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";

export const EditSaveCancel = ({
  selectOpened,
  selectSmall,
  onEdit,
  onSave,
  onCancel,
  setEditCompletedFromPrarent,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  const opened = useSelector(selectOpened);
  const small = useSelector(selectSmall);

  const [edit, setEdit] = useState(false);

  const [cancelEdit, setCancelEdit] = useState<any>(null);
  const go_edit = () => {
    setEdit(true);
    setCancelEdit(false);
  };
  const go_cancel = () => {
    setEdit(false);
    setCancelEdit(true);
    if (onCancel) onCancel();
  };
  useEffect(() => {
    if (onEdit) {
      onEdit(edit);
    }
  }, [edit, cancelEdit]);
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
        mt="xs"
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
            type="button"
            variant="default"
            radius="xs"
            onClick={go_cancel}
          >
            {t("cancel", "Cancel")}
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
