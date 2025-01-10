import React from "react";
import InlineEdit from "./InlineEdit";
import styles from "../styles/Matter.module.css";

const TitleSection = ({
  title,
  isEditing,
  darkMode,
  setEditingSection,
  onSaveTitle,
}) => {
  return (
    <div className="d-flex align-items-center">
      {isEditing ? (
        <InlineEdit
          value={title}
          sectionName="Titel"
          darkMode={darkMode}
          onSave={onSaveTitle}
          onCancel={() => setEditingSection(null)}
        />
      ) : (
        <>
          <button
            className={`${styles.editIconButton}`}
            onClick={() => setEditingSection("title")}
          >
            <i className="fas fa-edit"></i>
          </button>
          <h1 className={`${styles.title} me-2`}>{title}</h1>
        </>
      )}
    </div>
  );
};

export default TitleSection;
