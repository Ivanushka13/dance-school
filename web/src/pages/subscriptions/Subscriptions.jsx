import "./Subscriptions.css";
import NavBar from "../../components/navbar/NavBar";
import {MdAccessTime, MdAssessment, MdCardMembership, MdInfo, MdLocalOffer, MdPayment} from 'react-icons/md';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import PageLoader from "../../components/PageLoader/PageLoader";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import InformationModal from "../../components/modal/info/InformationModal";
import EnumModal from "../../components/modal/enum/EnumModal";
import {updateSessionField} from "../../redux/slices/sessionSlice";
import {createSubscription, fetchSubscriptions} from "../../api/subscriptions";
import {fetchPaymentTypes, postPayment} from "../../api/payments";
import {fetchUserData} from "../../api/auth";

export default function Subscriptions() {

  const session = useSelector(state => state.session);
  const dispatch = useDispatch();

  const [paymentTypes, setPaymentTypes] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  useEffect(() => {
    fetchSubscriptions({is_expired: false}).then((subscriptions) => {
      setSubscriptions(subscriptions.subscription_templates);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при загрузке абонементов',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPaymentTypes({}).then((payment_types) => {
      setPaymentTypes(payment_types.payment_types);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при загрузке типов оплаты',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    }).finally(() => setLoading(false));
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handlePurchase = (sub) => {
    setSelectedSubscription(sub);
    setShowPaymentModal(true);
  }

  const handlePaymentSelect = (paymentType) => {
    setShowPaymentModal(false);
    setShowConfirmModal(true);
    setConfirmModalInfo({
      title: 'Подтверждение покупки абонемента',
      message: `Вы уверены, что хотите приобрести абонемент "${selectedSubscription.name}"?`,
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => purchaseSub(selectedSubscription, paymentType)
    });
  }

  const fetchUserInfo = async () => {
    fetchUserData().then((response) => {
      dispatch(updateSessionField({subscriptions: response.subscriptions}));
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при обновлении данных пользователя',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    });
  }

  const createPayment = async (payment_type) => {
    return postPayment(payment_type.id).catch((error) => {
      setModalInfo({
        title: 'Ошибка при оплате',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    });
  }

  const purchaseSub = async (sub, paymentType) => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const payment = await createPayment(paymentType);

      await createSubscription(session.id, sub.id, payment.id);

      await fetchUserInfo();

      setModalInfo({
        title: 'Абонемент успешно оформлен',
        message: '',
      });
      setShowInfoModal(true);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при оформлении абонемента',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  }

  const renderPaymentTypeOption = (paymentType) => (
    <>
      <MdPayment className="enum-option-icon"/>
      <span className="enum-option-name">{paymentType.name}</span>
    </>
  );

  const renderActiveSubscriptions = () => {
    if (session.subscriptions.filter(sub => sub.payment_id !== null).length === 0) {
      return (
        <div className="subscriptions-page active-subscriptions-section">
          <h2 className="subscriptions-page section-title">Ваши активные абонементы</h2>
          <div className="subscriptions-page no-active-subscriptions">
            <MdCardMembership className="subscriptions-page no-subscriptions-icon"/>
            <h3>У вас пока нет активных абонементов</h3>
            <p>Выберите подходящий абонемент из списка ниже, чтобы начать заниматься</p>
          </div>
        </div>
      );
    }

    return (
      <div className="subscriptions-page active-subscriptions-section">
        <h2 className="subscriptions-page section-title">Ваши активные абонементы</h2>
        <div className="subscriptions-page subscriptions-grid">
          {session.subscriptions
            .filter(sub => sub.payment_id !== null)
            .map((userSub) => (
              <div key={userSub.id} className="subscriptions-page subscription-card active-subscription">
                <div className="subscriptions-page active-badge">Активен</div>
                <div className="subscriptions-page card-header">
                  <h2 className="subscriptions-page card-title">{userSub.subscription_template.name}</h2>
                </div>
                <div className="subscriptions-page card-details">
                  <div className="subscriptions-page detail-item">
                    <MdAssessment className="subscriptions-page detail-icon"/>
                    <span
                      className="subscriptions-page detail-text">Количество занятий: {userSub.subscription_template.lesson_count}</span>
                  </div>
                  <div className="subscriptions-page detail-item">
                    <MdAccessTime className="subscriptions-page detail-icon"/>
                    <span
                      className="subscriptions-page detail-text">Действует до: {formatDate(userSub.subscription_template.expiration_date)}</span>
                  </div>
                  <div className="subscriptions-page detail-item">
                    <MdInfo className="subscriptions-page detail-icon"/>
                    <div className="subscriptions-page detail-text">
                      <span className="subscriptions-page detail-label">Доступные стили:</span>
                      <div className="subscriptions-page dance-styles">
                        {userSub.subscription_template.lesson_types.map((type) => (
                          <span key={type.id} className="subscriptions-page dance-style-tag">
                            {type.dance_style.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderAvailableSubscriptions = () => {
    return (
      <div className="subscriptions-page subscriptions-grid">
        {subscriptions.map((subscription, index) => (
          <div key={index} className="subscriptions-page subscription-card">
            <div className="subscriptions-page card-header">
              <h2 className="subscriptions-page card-title">{subscription.name}</h2>
            </div>
            <p className="subscriptions-page card-description">{subscription.description}</p>
            <div className="subscriptions-page card-details">
              <div className="subscriptions-page detail-item">
                <MdAssessment className="subscriptions-page detail-icon"/>
                <span className="subscriptions-page detail-text">Количество занятий: {subscription.lesson_count}</span>
              </div>

              <div className="subscriptions-page detail-item">
                <MdLocalOffer className="subscriptions-page detail-icon"/>
                <span className="subscriptions-page detail-text">Цена: {subscription.price}₽</span>
              </div>

              <div className="subscriptions-page detail-title">Доступные занятия:</div>

              {subscription.lesson_types && subscription.lesson_types.map((type) => (
                <div key={type.id} className="subscriptions-page detail-item lesson-type-item">
                  <MdInfo className="subscriptions-page detail-icon"/>
                  <span className="subscriptions-page detail-text">{type.dance_style.name}</span>
                </div>
              ))}
            </div>

            <button className="subscriptions-page request-button"
                    onClick={() => handlePurchase(subscription)}>Приобрести
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <NavBar/>
      <div className="subscriptions-page subscriptions-container">
        <PageLoader loading={loading} text="Загрузка абонементов...">
          <div className="subscriptions-page subscriptions-header">
            <h1 className="subscriptions-page subscriptions-title">АБОНЕМЕНТЫ</h1>
            <p className="subscriptions-page subscriptions-subtitle">Выберите подходящий вариант обучения</p>
          </div>

          {renderActiveSubscriptions()}

          {session && session.subscriptions && session.subscriptions.length > 0 && (
            <div className="subscriptions-page section-divider"></div>
          )}

          <div className="subscriptions-page available-subscriptions-section">
            <h2 className="subscriptions-page section-title">Доступные абонементы</h2>
            {renderAvailableSubscriptions()}
          </div>
        </PageLoader>
      </div>

      <EnumModal
        visible={showPaymentModal}
        onClose={async () => await setShowPaymentModal(false)}
        onSelect={handlePaymentSelect}
        title="Выберите способ оплаты"
        options={Object.values(paymentTypes)}
        renderOption={renderPaymentTypeOption}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        onClose={async () => await setShowConfirmModal(false)}
        onConfirm={confirmModalInfo.onConfirm}
        title={confirmModalInfo.title}
        message={confirmModalInfo.message}
        confirmText={confirmModalInfo.confirmText}
        cancelText={confirmModalInfo.cancelText}
      />

      <InformationModal
        visible={showInfoModal}
        onClose={async () => await setShowInfoModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
}