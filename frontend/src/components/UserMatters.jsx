import React, { useState, useEffect } from "react";
import { Table, Alert, Button, Form, Row, Col } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import CreateMatter from "./CreateMatter";
import UpdateDeleteMatter from "./UpdateDeleteMatter";
import Status, { processMatters } from "./Status";
import styles from "../styles/UserMatters.module.css";

const UserMatters = () => {
  const { isAdmin, isAuthenticated, loading } = useAuthStatus();
  const navigate = useNavigate();
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

  // --------------- UseEffects --------------- //

  // Check loading
  useEffect(() => {
    // If still loading do nothing
    if (loading) return;
    // If not logged in navigate to /login
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchMatters();
    }
  }, [loading, isAuthenticated]);

  // Update data when change is made
  useEffect(() => {
    fetchMatters();
  }, [statusFilter]);

  useEffect(() => {
    const processedMatters = processMatters({
      rawMatters,
      statusSortIndex,
      lastClicked: lastClicked || "status",
      titleSortAscending,
    });
    setMatters(processedMatters);
  }, [rawMatters, statusSortIndex, lastClicked, titleSortAscending]);

  // ----------------------------------------- //

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
      <h2 className={`${styles.pageHeader}`}>
        {isAdmin ? "Alla Ärenden" : "Mina Ärenden"}
      </h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="align-items-end mb-3">
        {/* Status filter dropdown */}
        <Col xs={12} md={4}>
          <Form.Label className={`${styles.filterLabel} mb-1`}>
            Status-filter
          </Form.Label>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${styles.filterSelecttion}`}
          >
            <option value="">Alla</option>
            <option value="Pending">I kö</option>
            <option value="Ongoing">Pågående</option>
            <option value="Completed">Klar</option>
            <option value="Cancelled">Avbruten</option>
          </Form.Select>
        </Col>

        {/* Create Matter Buttton */}
        <Col xs="auto">
          <Button
            variant="success"
            className={`${styles.createMatterBtn} mt-3`}
            onClick={() => setShowCreateModal(true)}
          >
            Skapa Ärende
          </Button>
        </Col>
      </Row>

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
            <th
              onClick={() => {
                setStatusSortIndex((prev) => (prev + 1) % 4);
                setLastClicked("status");
              }}
              style={{ cursor: "pointer" }}
            >
              <Status
                isSorting={true}
                statusSortIndex={statusSortIndex}
                statusFilter={statusFilter}
                lastClicked={lastClicked}
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
