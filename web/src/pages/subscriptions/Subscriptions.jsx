import "./Subscriptions.css";
import NavBar from "../../components/navbar/NavBar";
import {MdAccessTime, MdInfo, MdLocalOffer, MdAssessment, MdCardMembership} from 'react-icons/md';
import {useEffect, useState} from "react";
import {apiRequest} from "../../util/apiService";
import {useSelector} from 'react-redux';
import PageLoader from "../../components/PageLoader/PageLoader";

export default function Subscriptions() {

  const session = useSelector(state => state.session);

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubsc = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/subscriptionTemplates/search/full-info',
          data: {},
        });

        setSubscriptions(response.subscription_templates);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchSubsc();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const renderActiveSubscriptions = () => {
    if (!session || !session.subscriptions || session.subscriptions.length === 0) {
      return (
        <div className="active-subscriptions-section">
          <h2 className="section-title">Ваши активные абонементы</h2>
          <div className="no-active-subscriptions">
            <MdCardMembership className="no-subscriptions-icon"/>
            <h3>У вас пока нет активных абонементов</h3>
            <p>Выберите подходящий абонемент из списка ниже, чтобы начать заниматься</p>
          </div>
        </div>
      );
    }

    return (
      <div className="active-subscriptions-section">
        <h2 className="section-title">Ваши активные абонементы</h2>
        <div className="subscriptions-grid">
          {session.subscriptions
            .filter(sub => sub.payment_id !== null)
            .map((userSub) => (
              <div key={userSub.id} className="subscription-card active-subscription">
                <div className="active-badge">Активен</div>
                <div className="card-header">
                  <h2 className="card-title">{userSub.subscription_template.name}</h2>
                </div>
                <div className="card-details">
                  <div className="detail-item">
                    <MdAssessment className="detail-icon"/>
                    <span
                      className="detail-text">Количество занятий: {userSub.subscription_template.lesson_count}</span>
                  </div>
                  <div className="detail-item">
                    <MdAccessTime className="detail-icon"/>
                    <span
                      className="detail-text">Действует до: {formatDate(userSub.subscription_template.expiration_date)}</span>
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
      <div className="subscriptions-grid">
        {subscriptions.map((subscription, index) => (
          <div key={index} className="subscription-card">
            <div className="card-header">
              <h2 className="card-title">{subscription.name}</h2>
            </div>
            <p className="card-description">{subscription.description}</p>
            <div className="card-details">
              <div className="detail-item">
                <MdAssessment className="detail-icon"/>
                <span className="detail-text">Количество занятий: {subscription.lesson_count}</span>
              </div>

              <div className="detail-item">
                <MdLocalOffer className="detail-icon"/>
                <span className="detail-text">Цена: {subscription.price}₽</span>
              </div>

              <div className="detail-title">Доступные занятия:</div>

              {subscription.lesson_types && subscription.lesson_types.map((type) => (
                <div key={type.id} className="detail-item lesson-type-item">
                  <MdInfo className="detail-icon"/>
                  <span className="detail-text">{type.dance_style.name}</span>
                </div>
              ))}
            </div>

            <button className="request-button">Приобрести</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <NavBar/>
      <div className="subscriptions-container">
        <PageLoader loading={loading} text="Загрузка абонементов...">
          <div className="subscriptions-header">
            <h1 className="subscriptions-title">АБОНЕМЕНТЫ</h1>
            <p className="subscriptions-subtitle">Выберите подходящий вариант обучения</p>
          </div>

          {renderActiveSubscriptions()}

          {session && session.subscriptions && session.subscriptions.length > 0 && (
            <div className="section-divider"></div>
          )}

          <div className="available-subscriptions-section">
            <h2 className="section-title">Доступные абонементы</h2>
            {renderAvailableSubscriptions()}
          </div>
        </PageLoader>
      </div>
    </>
  );
}