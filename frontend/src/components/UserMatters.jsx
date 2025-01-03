import React, { useState, useEffect } from "react";
import { Table, Alert, Button, Form, Row, Col } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import CreateMatter from "./CreateMatter";
import UpdateDeleteMatter from "./UpdateDeleteMatter";
import Status, { processMatters } from "./Status";

const UserMatters = () => {
  const [matters, setMatters] = useState([]);
  const [error, setError] = useState("");
  const [selectedMatter, setSelectedMatter] = useState(null);

  // Control modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");

  // Lokal states for sorting
  const [titleSortAscending, setTitleSortAscending] = useState(true);
  const [statusSortIndex, setStatusSortIndex] = useState(0);

  // Raw data from server without local sorting
  const [rawMatters, setRawMatters] = useState([]);

  // State to decide which column was last clicked
  const [lastClicked, setLastClicked] = useState("");

  // Get Data from backend
  const fetchMatters = async () => {
    try {
      let url = "/matters/";
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      const { data } = await axiosReq.get(url);
      setRawMatters(data);
      setError("");
    } catch (err) {
      setError("Kunde inte hämta ärenden. Försök igen senare.");
    }
  };

  // Update data when change is made
  useEffect(() => {
    fetchMatters();
  }, [statusFilter]);

  useEffect(() => {
    const processedMatters = processMatters({
      rawMatters,
      statusSortIndex,
      lastClicked,
      titleSortAscending,
    });
    setMatters(processedMatters);
  }, [rawMatters, statusSortIndex, lastClicked, titleSortAscending]);

  // Handle dsiplay & modals
  const handleOpenEdit = (matter) => {
    setSelectedMatter(matter);
    setShowEditModal(true);
  };

  const handleOpenDelete = (matter) => {
    setSelectedMatter(matter);
    setShowDeleteModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedMatter(null);
    setShowEditModal(false);
  };

  const handleCloseDelete = () => {
    setSelectedMatter(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="container mt-4">
      <h2>Mina Ärenden</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* FILTER FORM (only status) */}
      <Form className="mb-3">
        <Row>
          <Col xs={12} md={4} className="mb-2">
            <Form.Label>Status-filter</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Alla</option>
              <option value="Pending">I kö</option>
              <option value="Ongoing">Pågående</option>
              <option value="Completed">Klar</option>
              <option value="Cancelled">Avbruten</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* CREATE MATTER BUTTON */}
      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowCreateModal(true)}
      >
        Skapa Ärende
      </Button>

      {/* MATTERS LIST */}
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* Klickable cloumn "Title" */}
            <th
              onClick={() => {
                setTitleSortAscending((prev) => !prev);
                setLastClicked("title");
              }}
              style={{ cursor: "pointer" }}
            >
              Titel{" "}
              {lastClicked === "title" && (titleSortAscending ? "🔼" : "🔽")}
            </th>
            {/* Clickable column "Status" */}
            <th>
              <Status
                isSorting={true}
                statusSortIndex={statusSortIndex}
                onSort={() => {
                  setStatusSortIndex((prev) => (prev + 1) % 4);
                  setLastClicked("status");
                }}
              />
            </th>
            <th>Noteringar</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {matters.map((matter) => (
            <tr key={matter.id}>
              <td>{matter.title}</td>
              <td>
                <Status status={matter.status} />
              </td>
              <td>{matter.notes || "Ingen notering"}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
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

      <CreateMatter
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        fetchMatters={fetchMatters}
        setError={setError}
      />

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
