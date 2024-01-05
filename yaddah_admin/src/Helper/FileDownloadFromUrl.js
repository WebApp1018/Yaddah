import axios from "axios";

export async function FileDownloadFromUrl(url, fileName) {
  axios({
    url: url,
    responseType: "blob",
    method: "GET",
  }).then((res) => {
    const href = URL.createObjectURL(res.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
}
