import { ColumnDef } from "@tanstack/react-table";
import { AppTable } from "../../../global/global-comp/Spreadsheet/Table";
import {
  ActionMenuCell,
  DefaultCell,
  EditDescription,
  HashTagCell,
  HashTagHeader,
  IamageCell,
  IamgeCellEdit,
  PriceCell,
  ReadOnlyCell,
  TypeCell,
} from "../../../global/global-comp/Spreadsheet/TableCells";
import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { MAX_NB_IMAGES } from "./ImagesZoneDeals";
type Deal = {
  main_pic: string;
  wtsb: string;
  title: string;
  quantity: string;
  price: string;
  hashtags: string[];
  body: string;
};

export const defaultColumns: ColumnDef<Deal>[] = [
  {
    accessorKey: "action",
    header: "#",
    cell: ActionMenuCell,
  },
  {
    accessorKey: "main_pic",
    header: "",
    cell: IamageCell,
  },
  {
    accessorKey: "wtsb",
    header: "Type",
    cell: TypeCell,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: PriceCell,
  },
  {
    accessorKey: "hashtags",
    header: ({ table }) => <HashTagHeader table={table} />,
    cell: HashTagCell,
  },
  {
    accessorKey: "body",
    header: "Description",
    cell: ReadOnlyCell,
  },
];
const defaultColumn: Partial<ColumnDef<Deal>> = {
  cell: DefaultCell,
};
export const DealsSpreadSheet = ({
  data,
  searchMyDeals,
  renew_or_terminate,
  t,
}) => {
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  const SecondRowRender = ({row, rowIndex, editingCell, table,data:dataS}) => {
    
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
  return (
    <Box mt="lg">
      <AppTable
        initData={data}
        columns={columns}
        SecondRowRender={SecondRowRender}
        defaultColumn={defaultColumn}
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
          if (colidx == 1) return 40;
          return null;
        }}
      />
    </Box>
  );
};
