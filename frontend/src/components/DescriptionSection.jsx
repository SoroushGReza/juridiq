import React from "react";
import InlineEdit from "./InlineEdit";
import styles from "../styles/Matter.module.css";

const DescriptionSection = ({
  description,
  isEditing,
  darkMode,
  setEditingSection,
  onSaveDescription,
}) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <h4 className="fw-bold ms-3">Beskrivning</h4>
        <button
          className={`${styles.editIconButton}`}
          onClick={() => setEditingSection("description")}
        >
          <i className="fas fa-edit"></i>
        </button>
      </div>
      {isEditing ? (
        <InlineEdit
          value={description}
          sectionName="Beskrivning"
          darkMode={darkMode}
          onSave={onSaveDescription}
          onCancel={() => setEditingSection(null)}
        />
      ) : (
        <p
          className={`${styles.description}`}
          style={{ whiteSpace: "pre-line" }}
        >
          {description}
        </p>
      )}
    </>
  );
};

export default DescriptionSection;
