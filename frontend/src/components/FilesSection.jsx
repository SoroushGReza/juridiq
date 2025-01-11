import React from "react";
import { Form } from "react-bootstrap";
import styles from "../styles/FilesSection.module.css";

const FilesSection = ({ files, onDeleteFile, onUploadFile }) => {
  // Handle file uploads
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    onUploadFile(newFiles);
  };

  return (
    <div className={`${styles.filesSection}`}>
      {/* Titel & Upload Button */}
      <div className="d-flex align-items-center">
        <h5 className="fw-bold ms-3">Filer</h5>
        <label
          htmlFor="fileUpload"
          className={`${styles.uploadButton} ms-2`}
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
            const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileUrl);
            const isPDF = /\.pdf$/i.test(fileUrl);
            const isTxt = /\.txt$/i.test(fileUrl);

            return (
              <div key={index} className={`${styles.filePreview} mb-4`}>
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={`Fil ${index + 1}`}
                    className={`${styles.imagePreview} img-fluid`}
                  />
                ) : isPDF ? (
                  <iframe
                    src={fileUrl}
                    title={`PDF ${index + 1}`}
                    className={`${styles.pdfPreview}`}
                  />
                ) : isTxt ? (
                  <div className={`${styles.txtPreview}`}>
                    <p>Förhandsvisning av textfil</p>
                  </div>
                ) : (
                  <div className={`${styles.unsupportedFile}`}>
                    <p>Kan inte förhandsvisa denna filtyp.</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      Ladda ner filen här
                    </a>
                  </div>
                )}

                {/* Trashcan Icon */}
                <button
                  className={`${styles.deleteButton}`}
                  onClick={() => onDeleteFile(fileObj.id)}
                  title="Ta bort fil"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            );
          })
        ) : (
          <p className={`${styles.noFiles} ms-3`}>Inga uppladdade filer</p>
        )}
      </div>
    </div>
  );
};

export default FilesSection;
