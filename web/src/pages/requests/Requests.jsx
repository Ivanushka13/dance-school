import React, {useEffect, useState} from 'react';
import NavBar from "../../components/navbar/NavBar";
import {MdEmail, MdPhone, MdInfoOutline} from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {styled} from '@mui/material/styles';
import "./Requests.css";
import {apiRequest} from "../../util/apiService";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

const StyledDialogTitle = styled(DialogTitle)({
  margin: 0,
  padding: '24px',
  backgroundColor: '#1a1a1a',
  color: '#fff !important',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '1.5',
  '& h2': {
    color: '#fff'
  }
});

const AnimatedButton = styled(Button)(({theme, variant}) => ({
  height: '48px',
  borderRadius: '8px',
  textTransform: 'none',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  backgroundColor: variant === 'contained' ? '#1a1a1a' : 'transparent',
  color: variant === 'contained' ? '#fff' : '#666',
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: variant === 'contained' ? '#333' : 'rgba(0, 0, 0, 0.04)',
    color: variant === 'contained' ? '#fff' : '#333',
    boxShadow: variant === 'contained' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none'
  },
  '&:active': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
  }
}));

const Requests = () => {

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/lessons/search/teacher',
          data: {
            is_confirmed: false,
            terminated: false
          }
        });

        setRequests(response.lessons);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        setModalInfo({
          title: 'Ошибка во время загрузки заявок',
          message: error.message || String(error),
        });
        setShowModal(true);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);


  const handleCreateIndividual = () => {
    setOpenDialog(false);
    navigate('/register');
  };

  const handleCreateSlot = () => {
    setOpenDialog(false);
    navigate('/createSlot');
  };

  const handleRequestClick = (request_id) => {
    navigate(`/request-details/${request_id}`);
  };


  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="page-wrapper">
        <NavBar/>
        <div className="requests-page">
          <PageLoader loading={loading} text="Загрузка заявок...">
            <div className="content">
              <h1>Заявки на преподавание</h1>
              {requests && requests.length > 0 ? (
                <div className="request-cards">
                  {requests.map(request => (
                    <div
                      key={request.id}
                      className="request-card"
                      onClick={() => handleRequestClick(request.id)}
                    >
                      <div className="request-avatar-circle">
                        {getInitials(
                          request.actual_students[0].user.first_name,
                          request.actual_students[0].user.last_name
                        )}
                      </div>
                      <div className="request-card-name">
                        {request.actual_students[0].user.last_name} {request.actual_students[0].user.first_name}
                        <div className="request-card-middleName">{request.actual_students[0].user.middle_name}</div>
                      </div>
                      <div
                        className={`request-card-level ${request.actual_students[0].level.id}`}>{request.actual_students[0].level.name}</div>
                      <div className="request-card-contact">
                        <MdEmail/>
                        {request.actual_students[0].user.email}
                      </div>
                      <div className="request-card-contact">
                        <MdPhone/>
                        {request.actual_students[0].user.phone_number}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-requests">
                  <div className="no-requests-icon">
                    <MdInfoOutline/>
                  </div>
                  <h2>У вас пока нет заявок на преподавание</h2>
                  <p>Создайте занятие или дождитесь, когда ученики оставят заявки на обучение</p>
                </div>
              )}
              <button className="add" onClick={() => setOpenDialog(true)}>+</button>
            </div>
          </PageLoader>
        </div>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            style: {
              borderRadius: '12px',
              overflow: 'hidden',
              minWidth: '400px',
              margin: '16px'
            }
          }}
        >
          <StyledDialogTitle>
            Создание занятия
          </StyledDialogTitle>
          <DialogContent style={{
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Выберите тип занятия, которое хотите создать
            </div>
          </DialogContent>
          <DialogActions
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#f5f5f5'
            }}
          >
            <AnimatedButton
              onClick={handleCreateIndividual}
              variant="contained"
              fullWidth
            >
              Индивидуальное занятие
            </AnimatedButton>
            <AnimatedButton
              onClick={handleCreateSlot}
              variant="contained"
              fullWidth
            >
              Слот
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setOpenDialog(false)}
              variant="text"
              fullWidth
            >
              Отмена
            </AnimatedButton>
          </DialogActions>
        </Dialog>
      </div>
      <InformationModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalInfo.onClose) {
            modalInfo.onClose();
          }
        }}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default Requests;