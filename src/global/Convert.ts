export const convertTablesToCSV = ({ content }) => {
  if (!content || content == "") {
    return "";
  }
  let div = document.createElement("div");
  div.innerHTML = content;
  if (!div) {
    console.error("Div not found");
    return "";
  }
  let tables = div.getElementsByTagName("table");

  let innerText: string = div.innerText;
  for (let i = 0; i < tables.length; i++) {
    let table = tables[i];
    let csvContent = "";
    let rows = table.getElementsByTagName("tr");
    for (let j = 0; j < rows.length; j++) {
      let cells =
        rows[j].getElementsByTagName("th").length > 0
          ? rows[j].getElementsByTagName("th")
          : rows[j].getElementsByTagName("td");
      for (let k = 0; k < cells.length; k++) {
        csvContent += cells[k].innerText.trim() + "\t";
      }
      csvContent = csvContent.slice(0, -1) + "\n";
    }
    innerText = innerText.replace(table.outerText, csvContent.trim());
  }
  return innerText;
};
export const parseContent = ({ content }) => {
  let tables_count = 0;
  if (!content || content == "") {
    return {
      text: "",
      tables: "",
      text_n_table: "",
      tables_count,
    };
  }
  let div = document.createElement("div");
  div.innerHTML = content;
  if (!div) {
    console.error("Div not found");
    return {
      text: "",
      tables: "",
      text_n_table: "",
    };
  }
  let tables = div.getElementsByTagName("table");
  let content_tables = "";
  let content_text = div.innerText;
  tables_count = tables.length;
  for (let i = 0; i < tables.length; i++) {
    let table = tables[i];
    content_tables = content_tables + table.outerHTML;
    content_text = content_text.replace(table.outerText, "");
    if (table.parentNode && table.parentNode.parentNode) {
      // Move the table out of the wrapper
      table.parentNode.parentNode.insertBefore(table, table.parentNode);
    }
  }
  return {
    text: content_text,
    tables: content_tables,
    text_n_table: div.innerHTML, //content// content_text + content_tables
    tables_count: tables_count,
  };
};