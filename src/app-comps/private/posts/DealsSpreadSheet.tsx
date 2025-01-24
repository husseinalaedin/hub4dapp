import { ColumnDef } from "@tanstack/react-table";
import {
  AppTable,
  getDivContentWithLineBreaks,
} from "../../../global/global-comp/Spreadsheet/Table";
import {
  ActionMenuCell,
  ChangeFlagCell,
  DefaultCell,
  EditDescription,
  HashTagCell,
  HashTagHeader,
  IamageCell,
  IamgeCellEdit,
  PriceCell,
  QuantityCell,
  ReadOnlyCell,
  TypeCell,
} from "../../../global/global-comp/Spreadsheet/TableCells";
import { useEffect, useRef, useState } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import { MAX_NB_IMAGES } from "./ImagesZoneDeals";
import {
  BUILD_API,
  CLOUDFARE_IMAGE_URL1,
  G,
  useMessage,
} from "../../../global/G";
import { useAxiosPut } from "../../../hooks/Https";
import { useDbData } from "../../../global/DbData";
import { useBlocker } from "react-router";
import { ConfirmUnsaved } from "../../../global/PopUpDialogs";
import { useGlobalStyl } from "../../../hooks/useTheme";
type Deal = {
  main_pic: string;
  wtsb: string;
  title: string;
  quantity: string;
  price: string;
  hashtags: string[];
  body: string;
};

export const DealsSpreadSheet = ({
  data: initData,
  searchMyDeals,
  renew_or_terminate,
  t,
}) => {
  const defaultColumns: ColumnDef<Deal>[] = [
    {
      accessorKey: "action",
      header: "#",
      cell: ActionMenuCell,
    },
    {
      accessorKey: "changed",
      header: "c",
      cell: ChangeFlagCell,
    },
    {
      accessorKey: "main_pic",
      header: "Pic",
      cell: IamageCell,
    },
    {
      accessorKey: "wtsb",
      header: t("Type", "Type"),
      cell: TypeCell,
    },
    {
      accessorKey: "title",
      header: t("title", "Title"),
    },
    {
      accessorKey: "quantity_n_uom",
      header: t("quantity", "Quantity"),
      cell: QuantityCell,
    },
    {
      accessorKey: "price_n_curr",
      header: t("price", "Price"),
      cell: PriceCell,
    },
    {
      accessorKey: "hashtags",
      header: ({ table }) => <HashTagHeader table={table} />,
      cell: HashTagCell,
    },
    {
      accessorKey: "body",
      header: t("description", "Description"),
      cell: ReadOnlyCell,
    },
  ];
  const defaultColumn: Partial<ColumnDef<Deal>> = {
    cell: DefaultCell,
  };
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);
  const tableRef = useRef<any>(null);
  const SecondRowRender = ({
    row,
    rowIndex,
    editingCell,
    table,
    data: dataS,
  }) => {
    if (!editingCell) return <></>;
    if (editingCell[2] == "main_pic")
      return (
        <IamgeCellEdit
          data={dataS}
          row={row}
          rowIndex={rowIndex}
          table={table}
          // images={images}
          // setImages={setImages}
          // pictures={pictures}
          // main_pic={main_pic}
          // setMain_pic={setMain_pic}
        />
      );
    return <EditDescription row={row} rowIndex={rowIndex} table={table} />;
  };
  const { error, succeed, info } = useMessage();
  const [data, setData] = useState<any>(() => [...initData]);
  const [dataToPut, setDataToPut] = useState([]);
  const [dataToDelete, setDataToDelete] = useState([]);
  let { getCurrFromSymbol } = useDbData();
  const { classes: classesG } = useGlobalStyl();
  let {
    data: dataPut,
    isLoading: isLoadingPut,
    succeeded: succeededPut,
    errorMessage: errorMessagePut,
    executePut,
  } = useAxiosPut(BUILD_API("deals/company/mass"), {
    changed: dataToPut,
    deleted: dataToDelete,
  });
  useEffect(() => {
    let errorMsg = errorMessagePut;
    if (tableRef && tableRef.current && tableRef.current.gotSaved)
      if (errorMsg) tableRef.current.gotSaved(true, errorMsg);
    if (succeededPut) {
      let succeededMsg = dataPut?.message;
      let ids = dataPut?.info?.ids;
      ids = ids ? ids : [];
      if (tableRef && tableRef.current && tableRef.current.gotSaved) {
        tableRef.current.gotSaved(false, succeededMsg, ids);
      }

      succeed(succeededMsg);
    }

    if (errorMsg) error(errorMsg);
  }, [errorMessagePut, succeededPut]);
  const formulate_object = (i) => { 
    let quantity = G.parseNumberAndString(data[i].quantity_n_uom);
    let price = G.parseNumberAndString(data[i].price_n_curr);
    let pics =
      data[i].pictures && data[i].pictures != ""
        ? data[i].pictures.split(" ")
        : [];
    return {
      id: data[i].id,
      main_pic: data[i].main_pic,
      title: data[i].title,
      pictures: pics,
      wtsb: data[i].wtsb,
      quantity: quantity.number,
      uom: quantity.text,
      price: price.number,
      curr: getCurrFromSymbol(price.text),
      hashtags: data[i].hashtags,
      body: data[i].body,
      ref: data[i].id == "new" ? data[i].ref : "",
      is_draft: data[i].is_draft,
    };
  };
  const onSave = () => {
    if (!(tableRef && tableRef.current)) return;
    let deletedIds = tableRef.current.getDeletedIds();
    setDataToDelete(deletedIds);
    let edited_data: any = [];
    for (let i = 0; i < data.length; i++) {
      if (!!data[i].changed) {
        let datum = formulate_object(i);
        edited_data.push(datum);
      }
    }
    setDataToPut(edited_data);
    if (edited_data.length > 0 || deletedIds.length > 0) {
      executePut();
    }
  };
  let blocker = useBlocker(
    ( ) =>
      tableRef &&
      tableRef.current &&
      tableRef.current.dataEdited() 
  );
  return (
    <Box mt="lg" pos="relative">
      <LoadingOverlay
        visible={isLoadingPut}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Box>
        <ConfirmUnsaved blocker={blocker} />
      </Box>
      <Box 
        opacity={blocker.state === "blocked" ? 0.1 : 1}
        style={{
          pointerEvents: blocker.state === "blocked" ? "none" : "inherit",
        }}
      >
        <AppTable
          ref={tableRef}
          data={data}
          setData={setData}
          columns={columns}
          SecondRowRender={SecondRowRender}
          defaultColumn={defaultColumn}
          onSave={onSave}
          showSecondRow={(row, editingCell, table) => {
            return (
              table &&
              table.options &&
              table.options.meta &&
              row &&
              (table.options.meta.cellInEdit(row.index, -1, "body") ||
                table.options.meta.cellInEdit(row.index, -1, "main_pic"))
            );
          }}
          fixedCols={(colidx) => {
            if (colidx == 1) return 20;
            if (colidx == 2) return 40;
            return null;
          }}
          colIs4Data={(colidx) => {
            if (colidx > 1) return true;
            return false;
          }}
          onCopyCell={(place, colidx, colid, defaultval, obj) => {
            let text = defaultval;
            let html = defaultval;
            if (place == "H" && colid == "hashtags") return "hashtags";
            if (place == "D") {
              if (colid == "main_pic" && obj && obj["main_pic"] != "") {
                text = `${CLOUDFARE_IMAGE_URL1}${obj["main_pic"]}/public`;
                html = text;
              }
              if (colid == "body" && obj && obj["body"] != "") {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = defaultval;
                text = getDivContentWithLineBreaks(tempDiv);
                text = `"` + text + `"`;
              }
            }
            return {
              text: text,
              html: html,
            };
          }}
        />
      </Box>
    </Box>
  );
};
