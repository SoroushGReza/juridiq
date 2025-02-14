import React from "react";
import InlineEdit from "./InlineEdit";
import styles from "../styles/Matter.module.css";

const NotesSection = ({
  notes,
  isEditing,
  isAdmin,
  isDelegatedAdmin,
  userId,
  ownerId,
  darkMode,
  setEditingSection,
  onSaveNotes,
}) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <h4 className={`${styles.sectionHeader} fw-bold ms-3`}>Noteringar</h4>
        {(isAdmin || (isDelegatedAdmin && ((ownerId?.id ?? ownerId) !== userId))) && (
          <button
            className={`${styles.editIconButton}`}
            onClick={() => setEditingSection("notes")}
            title="Redigera noteringar"
          >
            <i className="fas fa-edit"></i>
          </button>
        )}
      </div>
      {isEditing ? (
        <InlineEdit
          value={notes || ""}
          sectionName="Noteringar"
          darkMode={darkMode}
          onSave={onSaveNotes}
          onCancel={() => setEditingSection(null)}
        />
      ) : (
        <p className={`${styles.notes} mt-1 ms-3`}>
          {notes ? notes : "Ingen notering"}
        </p>
      )}
    </>
  );
};

export default NotesSection;
