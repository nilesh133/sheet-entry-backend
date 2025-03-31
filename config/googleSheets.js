const https = require("https");
const dotenv = require("dotenv");

dotenv.config();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Sheet1";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

async function getNewAccessToken() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: "refresh_token",
        });

        const options = {
            method: "POST",
            hostname: "oauth2.googleapis.com",
            path: "/token",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": postData.length,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                const response = JSON.parse(data);
                resolve(response.access_token);
            });
        });

        req.on("error", (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function createGoogleSheetRow(rowData) {
    try {
        const ACCESS_TOKEN = await getNewAccessToken();
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
        return { status: true };
    } catch (e) {
        console.log("Error While Creating A GoogleSheet Row", e);
        return { status: false, error: e };
    }
}

module.exports = { createGoogleSheetRow };
