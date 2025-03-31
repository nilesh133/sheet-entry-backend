const sheets = require("../config/googleSheets");
const dotenv = require("dotenv");
dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Your Google Sheets ID
const RANGE = "Sheet1!A:F"; // Adjust based on column count

const saveFormData = async (req, res) => {
    try {
        const { Date, Person, Profile, Company, Progress, Additional } = req.body;
        if (!Date || !Person || !Profile, !Company || !Progress || !Additional) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: "RAW",
            requestBody: {
                values: [[Date, Person, Profile, Company, Progress, Additional]],
            },
        });

        res.status(200).json({ message: "Data saved to Google Sheets" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { saveFormData };