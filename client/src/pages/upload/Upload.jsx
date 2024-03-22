import "./upload.css"
import templateCSV from "../upload/template.csv"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import CustomAlert from "../../components/alert/Alert"
import CheckToken from "../../hooks/CheckToken"
import emailjs from "emailjs-com"
import { useNavigate } from "react-router-dom"

const Upload = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const { user, dispatch } = useContext(AuthContext);
    const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);
    const [inputKey, setInputKey] = useState(0);
    const navigate = useNavigate()
    const [showUploadSuccessfulAlert, setShowUploadSuccessfulAlert] = useState(false);
    const [showUploadFailAlert, setShowUploadFailAlert] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }
        if (!user.isStaff) {
            navigate("/dashboard");
        }
        setInputKey(prevKey => prevKey + 1);
    }, [user, navigate, csvFile]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
            setFileName(file.name);
        }
    };

    const individualEmail = async (csvData) => {
        const rows = csvData.split("\n").slice(1); // Skip first row
        let rowNumber = 1;
        let successCount = 0;

        if (rows.length === 0) {
            console.error("No data found in the CSV file.");
            setShowUploadFailAlert(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const row of rows) {
            const [name, email, lecturer, module] = row.split(",").slice(0, 4);
            if (!email) {
                console.error("Skipping row " + rowNumber + " due to invalid email, incomplete or empty data.");
                rowNumber++;
                continue;
            }
            const trimmedEmail = email.trim();
            if (name && email && emailRegex.test(trimmedEmail)) {
                try {
                    await sendEmail(name, trimmedEmail, lecturer, module);
                    successCount++;
                } catch (error) {
                    console.error("Failed to send email for row " + rowNumber + ":", error);
                }
            } else {
                console.error("Skipping row " + rowNumber + " due to invalid email, incomplete or empty data.");
            }
            rowNumber++;
        }
        if (successCount > 0) {
            setShowUploadSuccessfulAlert(true);
        } else {
            setShowUploadFailAlert(true);
        }
    };

    const handleUploadButtonClick = () => {
        if (!user.isStaff) {
            console.error("You are not authorised!");
            return;
        }
        if (csvFile) {
            const fileName = csvFile.name;
            const csvRegex = /^(?=.*\.csv$).+/i;

            if (csvRegex.test(fileName)) {
                const reader = new FileReader();

                reader.onload = () => {
                    const csvData = reader.result;
                    individualEmail(csvData);
                    setCsvFile(null);
                    setFileName("");
                };

                reader.readAsText(csvFile);
            } else {
                console.error("Please select a CSV file.");
            }
        } else {
            console.error("No CSV file uploaded");
        }
    };

    const sendEmail = async (to_name, to_email, lecturer_name, module_code) => {
        return emailjs
            .send(
                process.env.REACT_APP_SERVICE_ID,
                process.env.REACT_APP_UPLOAD_TEMPLATE_ID,
                {
                    to_name,
                    to_email,
                    lecturer_name,
                    module_code,
                },
                process.env.REACT_APP_PUBLIC_KEY
            )
            .then((response) => {
                console.log("Email sent successfully!", response.status, response.text);
            })
            .catch((error) => {
                console.error("Email sending failed:", error);
                throw error;
            });
    };

    const handleCloseAlert = (alertType) => {
        if (alertType === "uploadSuccessAlert") {
            setShowUploadSuccessfulAlert(false);
        } else if (alertType === "uploadFailAlert") {
            setShowUploadFailAlert(false);
        }
    };

    return (
        <div>
            <Navbar isUploadPage={true} />
            <Header />
            <div className="centered-container">
                <div className="booking-content">
                    <h2>Upload CSV File</h2>
                    <div>
                        <input
                            key={inputKey}
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                            ref={(fileInput) => fileInput && (fileInput.value = null)}
                        />
                        <button className="browseButton"
                            onClick={() => document.querySelector('input[type="file"]').click()}>
                            Browse
                        </button>
                        <span> {fileName}</span>
                    </div>
                    <p className="downloadTemplate">
                        Download template: <a href={templateCSV} download>template.csv</a>
                    </p>
                </div>
                <button className="uploadButton" onClick={handleUploadButtonClick}>Upload</button>
            </div>
            {showUploadSuccessfulAlert && (
                <CustomAlert
                    message="Upload successful."
                    onClose={() => handleCloseAlert("uploadSuccessAlert")}
                />
            )}
            {showUploadFailAlert && (
                <CustomAlert
                    message="Upload failed due to empty file or invalid data."
                    onClose={() => handleCloseAlert("uploadFailAlert")}
                />
            )}
            {showLogoutAlert && (
                <CustomAlert
                    message="Your session has expired, please relogin."
                    onClose={handleLogout}
                />)}
        </div>
    );
};

export default Upload;
