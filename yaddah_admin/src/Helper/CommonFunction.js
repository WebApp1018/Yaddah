import { utils, write } from "xlsx";

const GenerateExcelFile = (data) => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileUrl = URL.createObjectURL(fileData);
  return fileUrl;
};

export { GenerateExcelFile };
