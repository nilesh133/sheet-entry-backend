const https = require("https");
const dotenv = require("dotenv");

dotenv.config();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const SHEET_NAME =  "Sheet1";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN 

const createGoogleSheetRow = async (rowData) => {
    try{
        const rowData = {
            values: [["John Doe", "johndoe@example.com", "New Entry"]],
        };
        const postData = JSON.stringify(rowData);

        const options = {
          method: "POST",
          hostname: "sheets.googleapis.com",
          path: `/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW`,
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
            "Content-Length": postData.length,
          },
        };
        
        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            console.log("Row added successfully:", JSON.parse(data));
          });
        });
        
        req.on("error", (e) => console.error("Error:", e));
        req.write(postData);
        req.end();
        return {status:true}
    }catch(e){
        console.log('Error While Creating A GoogleSheet Row',e)
        return {status:false,error:e}
    }
}
// createGoogleSheetRow()
module.exports = {
    createGoogleSheetRow:createGoogleSheetRow
};