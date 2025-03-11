import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
// Components
import ProfileForm from "../components/ProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import DeleteAccountModal from "../components/DeleteAccountModal";
import Alerts from "../components/Alerts";
import BankAccountForm from "../components/BankAccountForm";
// Styling
import styles from "../styles/Profile.module.css";
import FormStyles from "../styles/FormStyles.module.css";
// Hooks
import useAuthStatus from "../hooks/useAuthStatus";

function Profile() {
  // State to store user profile info
  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    surname: "",
    phone_number: "",
    bank_account: "",
    stripe_account_id: "",
  });

  // Create Express account for delegated admins
  const handleCreateExpressAccount = async () => {
    try {
      const { data } = await axiosReq.post("/accounts/connect/create_express/");
      if (data.onboarding_url) {
        // Open Stripe Hosted Onboarding
        window.location.href = data.onboarding_url;
      }
    } catch (error) {
      console.error("Misslyckades att skapa Express-konto:", error);
      setErrorMessage("Kunde inte skapa Stripe Express-konto. Se loggar.");
    }
  };

  // State for password change
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });

  // State to delete account (password verification)
  const [deletePassword, setDeletePassword] = useState("");

  // Success and Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Modal to handle account deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { isDelegatedAdmin } = useAuthStatus();

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => {
    setDeletePassword("");
    setErrorMessage("");
    setShowDeleteModal(true);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosReq.get("/accounts/profile/");
        setProfileData({
          email: data.email,
          name: data.name,
          surname: data.surname,
          phone_number: data.phone_number,
          bank_account: data.bank_account || "",
          stripe_account_id: data.stripe_account_id || "",
        });
      } catch (error) {
        console.error("Kunde inte hämta profil: ", error);
        setErrorMessage("Kunde inte hämta profilinformation.");
      }
    };

    fetchProfile();
  }, []);

  // Update profile data
  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axiosReq.put("/accounts/profile/", profileData);
      setSuccessMessage("Profilen uppdaterades!");
    } catch (error) {
      console.error("Fel vid uppdatering av profil: ", error);
      setErrorMessage("Kunde inte uppdatera profilinformationen.");
    }
  };

  // Handle password change
  const handleChangePassword = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const { old_password, new_password } = passwordData;
    if (!old_password || !new_password) {
      setErrorMessage("Fyll i både gammalt och nytt lösenord.");
      return;
    }

    try {
      const response = await axiosReq.put("/accounts/change-password/", {
        old_password,
        new_password,
      });

      // Update token after password change
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        const tokenResponse = await axiosReq.post("/auth/token/refresh/", {
          refresh: refreshToken,
        });

        // Save new access token in local storage
        localStorage.setItem("access", tokenResponse.data.access);
        axiosReq.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenResponse.data.access}`;
      }

      setSuccessMessage(
        "Lösenordet har ändrats och du är fortfarande inloggad."
      );
      setPasswordData({ old_password: "", new_password: "" });
    } catch (error) {
      console.error("Fel vid byte av lösenord: ", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.old_password
      ) {
        setErrorMessage("Felaktigt gammalt lösenord.");
      } else {
        setErrorMessage("Kunde inte uppdatera lösenordet.");
      }
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!deletePassword) {
      setErrorMessage("Vänligen fyll i ditt lösenord.");
      return;
    }

    try {
      await axiosReq.delete("/accounts/delete-account/", {
        data: { password: deletePassword },
      });
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/";
    } catch (error) {
      console.error("Fel vid radering av konto: ", error);
      setErrorMessage("Kunde inte radera kontot.");
    }
  };

  return (
    <Container fluid className={FormStyles.pageContainer}>
      {/* --------------- Background Image --------------- */}
      <div className={styles.profileBackground}></div>
      <Row className="justify-content-center">
        <Col
          xs={12}
          md={10}
          lg={8}
          xl={6}
          className={`${FormStyles["formCol"]} mt-4 mb-4`}
        >
          {/* ---------- Alerts ---------- */}
          <Alerts successMessage={successMessage} errorMessage={errorMessage} />

          <h1 className={`${FormStyles.pageHeader} mb-4 text-center`}>
            Min Profil
          </h1>

          {/* ---------- Update profile ---------- */}
          <ProfileForm
            profileData={profileData}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                [e.target.name]: e.target.value,
              })
            }
            onSubmit={handleUpdateProfile}
          />

          <hr className="my-4" />

          {/* ---------- Change Password ---------- */}
          <ChangePasswordForm
            passwordData={passwordData}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                [e.target.name]: e.target.value,
              })
            }
            onSubmit={handleChangePassword}
          />

          <hr className="my-4" />

          {/* ---------- Bank Account ---------- */}
          {isDelegatedAdmin && (
            <BankAccountForm initialBankAccount={profileData.bank_account} />
          )}

          {/* ---------- Create Stripe Accounts BTN ---------- */}
          {isDelegatedAdmin && !profileData.stripe_account_id && (
            <div className="text-center my-3">
              <Button variant="info" onClick={handleCreateExpressAccount}>
                Skapa Stripe-konto
              </Button>
            </div>
          )}

          <hr className="my-4" />

          {/* ---------- Delete Account ---------- */}
          <div className={FormStyles.formWrapper}>
            <h1 className={`${FormStyles["formHeader"]} text-center`}>
              Radera Konto
            </h1>
            <p className={`${styles.deleteAccountParagraph} text-center`}>
              Om du vill radera ditt konto klicka på knappen nedan. Du kommer
              bli ombedd att fylla i ditt lösenord för att bekräfta.
            </p>
            <Button
              className={`${FormStyles.redBtn} mb-3`}
              variant="danger"
              onClick={handleShowDeleteModal}
            >
              Radera konto
            </Button>
          </div>
        </Col>
      </Row>
      {/* ---------- Delete Account Modal ---------- */}
      <DeleteAccountModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteAccount}
        password={deletePassword}
        onPasswordChange={setDeletePassword}
      />
    </Container>
  );
}

export default Profile;
