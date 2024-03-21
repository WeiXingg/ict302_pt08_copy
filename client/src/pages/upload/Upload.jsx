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

    useEffect(() => {
        if (!user) {
            return;
        }
        if (!user.isStaff)
        {
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

    const individualEmail = (csvData) => {
        const rows = csvData.split("\n").slice(1); // Skip first row
        let rowNumber = 1;

        rows.forEach(row => {
            const [name, email] = row.split(",").slice(0, 2);
            if (name && email) {
                sendEmail(name, email);
            } else {
                console.error("Skipping row " + rowNumber + " due to incomplete or empty data.");
            }
            rowNumber++;
        });
    };

    const handleUploadButtonClick = () => {
        if (!user.isStaff) {
            console.error("You are not authorised!");
            return;
        }
        if (csvFile) {
            const fileName = csvFile.name;
            const csvRegex = /^[^.]+\.(csv)$/i;
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

    const sendEmail = (to_name, to_email) => {
        emailjs.send(
            process.env.REACT_APP_SERVICE_ID,
            process.env.REACT_APP_TEMPLATE_ID,
            {
                to_name,
                to_email,
            },
            process.env.REACT_APP_PUBLIC_KEY
        )
            .then((response) => {
                console.log("Email sent successfully!", response.status, response.text);
            })
            .catch((error) => {
                console.error("Email sending failed:", error);
            });
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
            {showLogoutAlert && (
                <CustomAlert
                    message="Your session has expired, please relogin."
                    onClose={handleLogout}
                />)}
        </div>
    );
};

export default Upload;
