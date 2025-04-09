import "./Subscriptions.css";
import NavBar from "../../components/navbar/NavBar";
import { MdAccessTime, MdEvent, MdGroup, MdInfo } from 'react-icons/md';

export default function Subscriptions() {
    const subscriptions = [
        {
            title: "КУРС на 8 занятий",
            description: "Групповые занятия по 1,5 часа, 2 раза в неделю",
            duration: "4 недели",
            options: [
                {
                    name: "Абонемент для одного человека",
                    price: "7 000"
                },
                {
                    name: "Абонемент для семейных пар",
                    price: "11 500"
                },
                {
                    name: "Абонемент «безлимитный месяц»",
                    price: "9 200"
                },
                {
                    name: "Разовое посещение",
                    price: "1 200"
                },
                {
                    name: "Мини-группа (4 пары)",
                    price: "8 600"
                }
            ]
        },
        {
            title: "КУРС на 5 занятий",
            description: "Групповые занятия по 2 часа, 1 раз в неделю",
            duration: "5 недель",
            options: [
                {
                    name: "Абонемент для одного человека",
                    price: "6 000"
                },
                {
                    name: "Абонемент для семейных пар",
                    price: "10 300"
                },
                {
                    name: "Абонемент «безлимитный месяц»",
                    price: "10 600"
                },
                {
                    name: "Разовое посещение",
                    price: "1 500"
                }
            ]
        },
        {
            title: "Индивидуальные уроки",
            description: "Персональные занятия с преподавателем",
            duration: "Разовые занятия",
            options: [
                {
                    name: "С одним преподавателем",
                    price: "4 500"
                },
                {
                    name: "С двумя преподавателями",
                    price: "6 500"
                }
            ]
        }
    ];

    return (
        <>
            <NavBar />
            <div className="subscriptions-container">
                <div className="subscriptions-header">
                    <h1 className="subscriptions-title">АБОНЕМЕНТЫ</h1>
                    <p className="subscriptions-subtitle">Выберите подходящий вариант обучения</p>
                </div>
                <div className="subscriptions-grid">
                    {subscriptions.map((subscription, index) => (
                        <div key={index} className="subscription-card">
                            <div className="card-header">
                                <h2 className="card-title">{subscription.title}</h2>
                                <p className="card-description">{subscription.description}</p>
                            </div>
                            <div className="card-details">
                                <div className="detail-item">
                                    <MdAccessTime className="detail-icon" />
                                    <span className="detail-text">Длительность: {subscription.duration}</span>
                                </div>
                                {subscription.options.map((option, optIndex) => (
                                    <div key={optIndex} className="detail-item">
                                        <MdInfo className="detail-icon" />
                                        <span className="detail-text">{option.name}</span>
                                        <div className="card-price">
                                            <div className="price-amount">{option.price} ₽</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="request-button">Оставить заявку</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}