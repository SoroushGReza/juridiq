import React from "react";
import { Form } from "react-bootstrap";
import styles from "../styles/FilesSection.module.css";
import axios from "axios";
import TXTViewer from "../components/TXTViewer";

const FilesSection = ({ files, onDeleteFile, onUploadFile, darkMode }) => {
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    onUploadFile(newFiles);
  };

  // Function to open files in a new tab, handling TXT files with proper decoding
  const handleOpenFile = async (fileUrl, isTxt) => {
    if (isTxt) {
      try {
        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer",
        });
        const decoder = new TextDecoder("utf-8");
        const decodedContent = decoder.decode(new Uint8Array(response.data));
        const blob = new Blob([decodedContent], {
          type: "text/plain;charset=utf-8",
        });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (err) {
        console.error("Could not open the TXT file:", err);
      }
    } else {
      window.open(fileUrl, "_blank"); // Open other file types directly
    }
  };

  return (
    <div className={`${styles.filesSection} ${darkMode ? styles.dark : ""}`}>
      {/* Titel & Upload Button */}
      <div className="d-flex align-items-center">
        <h4 className={`fw-bold ms-3 ${darkMode ? styles.dark : ""}`}>Filer</h4>
        <label
          htmlFor="fileUpload"
          className={`${styles.uploadButton} ${
            darkMode ? styles.dark : ""
          } ms-2`}
          title="Ladda upp filer"
        >
          <i className="fas fa-plus"></i>
        </label>
        <Form.Control
          id="fileUpload"
          type="file"
          multiple
          className="d-none"
          onChange={handleFileUpload}
        />
      </div>

      {/* List of files */}
      <div className={`${styles.fileList}`}>
        {files && files.length > 0 ? (
          files.map((fileObj, index) => {
            const fileUrl =
              typeof fileObj === "string" ? fileObj : fileObj.file;
            const isImage = /\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i.test(fileUrl);
            const isPDF = /\.pdf(\?.*)?$/i.test(fileUrl);
            const isTxt = /\.txt(\?.*)?$/i.test(fileUrl);

            return (
              <div
                key={index}
                className={`${styles.filePreview} ${
                  darkMode ? styles.dark : ""
                }`}
              >
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={`Fil ${index + 1}`}
                    className={`${styles.imagePreview} ${
                      darkMode ? styles.dark : ""
                    }`}
                  />
                ) : isPDF ? (
                  <iframe
                    src={fileUrl}
                    title={`PDF ${index + 1}`}
                    className={`${styles.pdfPreview} ${
                      darkMode ? styles.dark : ""
                    }`}
                  />
                ) : isTxt ? (
                  <div
                    className={`${styles.txtPreview} ${
                      darkMode ? styles.dark : ""
                    }`}
                  >
                    <TXTViewer fileUrl={fileUrl} />
                  </div>
                ) : (
                  <div
                    className={`${styles.unsupportedFile} ${
                      darkMode ? styles.dark : ""
                    }`}
                  >
                    <p>Kan inte förhandsvisa denna filtyp.</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      Ladda ner filen här
                    </a>
                  </div>
                )}

                {/* Open File in new tab */}
                <button
                  className={`${styles.openButton} ${
                    darkMode ? styles.dark : ""
                  }`}
                  onClick={() =>
                    handleOpenFile(fileUrl, /\.txt$/i.test(fileUrl))
                  }
                  title="Öppna i ny flik"
                >
                  <i className="fas fa-external-link-alt"></i>
                </button>

                {/* Delete button */}
                <button
                  className={`${styles.deleteButton} ${
                    darkMode ? styles.dark : ""
                  }`}
                  onClick={() => onDeleteFile(fileObj.id)}
                  title="Ta bort fil"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            );
          })
        ) : (
          <p className={`${styles.noFiles} ${darkMode ? styles.dark : ""}`}>
            Inga uppladdade filer
          </p>
        )}
      </div>
    </div>
  );
};

export default FilesSection;
