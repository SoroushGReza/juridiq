import React, { useState, useEffect } from "react";
import { Table, Alert, Button, Form, Row, Col } from "react-bootstrap";
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

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");

  // Lokal states for sorting
  const [titleSortAscending, setTitleSortAscending] = useState(true);
  const [statusSortIndex, setStatusSortIndex] = useState(0);

  // Raw data from server without local sorting
  const [rawMatters, setRawMatters] = useState([]);

  // State to decide which column was last clicked
  const [lastClicked, setLastClicked] = useState("");

  // Define fecthMatters as functin
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

  // Call fetchMatters when status filter changes
  useEffect(() => {
    fetchMatters();
  }, [statusFilter]);

  // Sort "raMatters" locally based in sort state
  useEffect(() => {
    let sorted = [...rawMatters];

    const statusOrders = [
      ["Pending", "Ready", "Cancelled"], // index 0
      ["Ready", "Pending", "Cancelled"], // index 1
      ["Cancelled", "Pending", "Ready"], // index 2
    ];
    const customOrder = statusOrders[statusSortIndex];

    // Sortera efter status
    const statusSorter = (a, b) => {
      const indexA = customOrder.indexOf(a.status);
      const indexB = customOrder.indexOf(b.status);
      return indexA - indexB;
    };

    // Sortera efter titel
    const titleSorter = (a, b) => {
      if (a.title < b.title) return titleSortAscending ? -1 : 1;
      if (a.title > b.title) return titleSortAscending ? 1 : -1;
      return 0;
    };

    if (lastClicked === "status") {
      sorted.sort(statusSorter);
    } else if (lastClicked === "title") {
      sorted.sort(titleSorter);
    }
    setMatters(sorted);
  }, [rawMatters, titleSortAscending, statusSortIndex, lastClicked]);

  // Click handling for sorting
  const handleSortByStatus = () => {
    setStatusSortIndex((prev) => (prev + 1) % 3);
    setLastClicked("status");
  };

  const handleSortByTitle = () => {
    setTitleSortAscending((prev) => !prev);
    setLastClicked("title");
  };

  // CRUD modal handlers
  const handleOpenCreate = () => setShowCreateModal(true);
  const handleCloseCreate = () => setShowCreateModal(false);

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

  // Helper to trunkate title
  const truncateTitle = (fullTitle) => {
    if (!fullTitle) return "";
    return fullTitle.length > 20 ? `${fullTitle.slice(0, 20)}...` : fullTitle;
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
              <option value="Pending">Pending</option>
              <option value="Ready">Ready</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* CREATE MATTER BUTTON */}
      <Button variant="success" className="mb-3" onClick={handleOpenCreate}>
        Skapa Ärende
      </Button>

      {/* MATTERS LIST */}
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* Klickable cloumn "Title" */}
            <th onClick={handleSortByTitle} style={{ cursor: "pointer" }}>
              Titel{" "}
              {lastClicked === "title" ? (titleSortAscending ? "▲" : "▼") : ""}
            </th>
            {/* Clickable column "Status" */}
            <th onClick={handleSortByStatus} style={{ cursor: "pointer" }}>
              Status
              {lastClicked === "status" &&
                ` (steg ${statusSortIndex + 1} av 3)`}
            </th>
            <th>Noteringar</th>
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
