import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = [
    {
        id: 1,
        email: 'teacher@dance.com',
        password: 'teacher123',
        role: 'teacher',
        name: 'Преподаватель',
        lastName: 'Иванов',
        firstName: 'Иван',
        middleName: 'Иванович',
        phone: '+7 (999) 999-99-99',
        description: 'Опытный преподаватель танцев',
        level: null
    },
    {
        id: 2,
        email: 'student@dance.com',
        password: 'student123',
        role: 'student',
        name: 'Ученик',
        lastName: 'Петров',
        firstName: 'Петр',
        middleName: 'Петрович',
        phone: '+7 (888) 888-88-88',
        description: 'Занимаюсь танцами уже 2 года',
        level: 'Продвинутый'
    }
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateProfile = (profileData) => {
        const updatedUser = {
            ...user,
            ...profileData
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return Promise.resolve(updatedUser);
    };

    const updatePassword = (newPassword) => {
        const updatedUser = {
            ...user,
            password: newPassword
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return Promise.resolve(updatedUser);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};
