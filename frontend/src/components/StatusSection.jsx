import React from "react";
import styles from "../styles/Matter.module.css";
import Status from "./Status";
import { axiosReq } from "../api/axiosDefaults";

const StatusSection = ({
  matter,
  isAdmin,
  editingSection,
  setEditingSection,
  onStatusChange,
}) => {
  const handleStatusUpdate = async (status) => {
    await axiosReq.patch(`/matters/${matter.id}/`, { status });
    onStatusChange(status);
    setEditingSection(null);
  };

  return (
    <div className={`${styles.statusCol} d-flex justify-content-start`}>
      {isAdmin ? (
        <div className="position-relative">
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
            <i className="fas fa-chevron-down ms-2"></i>
          </p>

          {editingSection === "status" && (
            <div className={`${styles.dropdownMenu}`}>
              {["Pending", "Ongoing", "Completed", "Cancelled"].map(
                (status) => (
                  <p
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    className={
                      status === matter.status
                        ? `${styles.activeItem}`
                        : undefined
                    }
                  >
                    {status}
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
