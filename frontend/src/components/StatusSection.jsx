import React, { useEffect, useRef } from "react";
import styles from "../styles/Matter.module.css";
import Status from "./Status";
import { axiosReq } from "../api/axiosDefaults";
import { statusTranslations, statusIcons } from "./Status";

const StatusSection = ({
  matter,
  isAdmin,
  editingSection,
  setEditingSection,
  onStatusChange,
}) => {
  const dropdownRef = useRef(null);

  const handleStatusUpdate = async (status) => {
    await axiosReq.patch(`/matters/${matter.id}/`, { status });
    onStatusChange(status);
    setEditingSection(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (editingSection === "status") {
          setEditingSection(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingSection, setEditingSection]);

  return (
    <div className={`${styles.statusCol} d-flex justify-content-start`}>
      {isAdmin ? (
        <div className="position-relative" ref={dropdownRef}>
          <p
            className={`${styles.status} text-center mt-4`}
            onClick={() =>
              setEditingSection(editingSection === "status" ? null : "status")
            }
            style={{ cursor: "pointer" }}
            title="Redigera status"
          >
            <span className="fw-bold">Status: </span>
            <Status status={matter.status} />{" "}
            <i className={`${styles.statusIcon} fas fa-chevron-down ms-2`}></i>
          </p>

          {editingSection === "status" && (
            <div className={`${styles.dropdownMenu}`}>
              {Object.entries(statusTranslations).map(
                ([statusKey, statusValue]) => (
                  <p
                    key={statusKey}
                    onClick={() => handleStatusUpdate(statusKey)}
                    className={
                      statusKey === matter.status
                        ? `${styles.activeItem}`
                        : undefined
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>{statusIcons[statusKey]}</span>
                    {statusValue}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <p className={`${styles.status} text-center mt-4`}>
          <span className="fw-bold">Status: </span>
          <Status status={matter.status} />
        </p>
      )}
    </div>
  );
};

export default StatusSection;
