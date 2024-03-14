import "./upload.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import CustomAlert from "../../components/alert/Alert"
import CheckToken from "../../hooks/CheckToken"

const Upload = () => {
    const [csvFile, setCsvFile] = useState(null);
    const { user, dispatch } = useContext(AuthContext);
    const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
        }
    };

    const individualEmail = (csvData) => {
        const rows = csvData.split("\n").slice(1); // Skip first row
        let rowNumber = 1;

        rows.forEach(row => {
            const [name, email] = row.split(",");
            if (name && email) {
                sendEmail(name, email);
            } else {
                console.error("Skipping row " + rowNumber + " due to incomplete or empty data.");
            }
            rowNumber++;
        });
    };

    const handleUploadButtonClick = () => {
        if (csvFile) {
            const fileName = csvFile.name;
            const csvRegex = /^[^.]+\.(csv)$/i;
            if (csvRegex.test(fileName)) {
                const reader = new FileReader();

                reader.onload = () => {
                    const csvData = reader.result;
                    console.log("Uploaded CSV file:", csvData);
                    individualEmail(csvData);
                };

                reader.readAsText(csvFile);
            } else {
                console.error("Please select a CSV file.");
            }
        } else {
            console.error("No CSV file uploaded");
        }
    };


    const sendEmail = (name, email) => {
        // email logic
        console.log(`Sending email to ${name} at ${email}`);
    };

    return (
        <div>
            <Navbar isUploadPage={true} />
            <Header />
            <div className="centered-container">
                <div className="booking-content">
                    <h2>Upload CSV File</h2>
                    <input type="file" accept=".csv" onChange={handleFileUpload} />
                </div>
                <button className="uploadButton" onClick={handleUploadButtonClick}>Upload</button>
            </div>
            {showLogoutAlert && (
                <CustomAlert
                    message="Your session has expired, please relogin."
                    onClose={handleLogout}
                />)}
        </div>
    );
};

export default Upload;
