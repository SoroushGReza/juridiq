import React, { useState, useEffect } from "react";
import { Table, Alert, Button } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import CreateMatter from "./CreateMatter";
import UpdateDeleteMatter from "./UpdateDeleteMatter";

const UserMatters = () => {
  const [matters, setMatters] = useState([]);
  const [error, setError] = useState("");
  const [selectedMatter, setSelectedMatter] = useState(null);

  // Control modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchMatters();
    // eslint-disable-next-line
  }, []);

  const fetchMatters = async () => {
    try {
      const { data } = await axiosReq.get("/matters/");
      setMatters(data);
      setError("");
    } catch (err) {
      setError("Kunde inte hämta ärenden. Försök igen senare.");
    }
  };

  // ---- CREATE MATTER ----
  const handleOpenCreate = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
  };

  // ---- SELECT MATTER FOR EDITING / DELETION ----
  const handleOpenEdit = (matter) => {
    setSelectedMatter(matter);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedMatter(null);
    setShowEditModal(false);
  };

  const handleOpenDelete = (matter) => {
    setSelectedMatter(matter);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setSelectedMatter(null);
    setShowDeleteModal(false);
  };

  // Helper to truncate title to 20 characterss
  const truncateTitle = (fullTitle) => {
    if (!fullTitle) return "";
    return fullTitle.length > 20 ? `${fullTitle.slice(0, 20)}...` : fullTitle;
  };

  return (
    <div className="container mt-4">
      <h2>Mina Ärenden</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* CREATE MATTER BUTTON */}
      <Button variant="success" className="mb-3" onClick={handleOpenCreate}>
        Skapa Ärende
      </Button>

      {/* MATTERS LIST */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Status</th>
            <th>Noteringar</th>
            <th>Fil</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {matters.map((matter) => (
            <tr key={matter.id}>
              <td>{truncateTitle(matter.title)}</td>
              <td>{matter.status}</td>
              <td>{matter.notes || "Ingen notering"}</td>
              <td>
                {matter.file ? (
                  <a
                    href={matter.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visa Fil
                  </a>
                ) : (
                  "Ingen fil"
                )}
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpenEdit(matter)}
                >
                  Ändra
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleOpenDelete(matter)}
                >
                  Radera
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* CREATE MATTER MODAL */}
      <CreateMatter
        show={showCreateModal}
        handleClose={handleCloseCreate}
        fetchMatters={fetchMatters}
        setError={setError}
      />

      {/* UPDATE & DELETE MATTERS MODAL */}
      <UpdateDeleteMatter
        matter={selectedMatter}
        showEditModal={showEditModal}
        showDeleteModal={showDeleteModal}
        handleCloseEdit={handleCloseEdit}
        handleCloseDelete={handleCloseDelete}
        fetchMatters={fetchMatters}
        setError={setError}
      />
    </div>
  );
};

export default UserMatters;
