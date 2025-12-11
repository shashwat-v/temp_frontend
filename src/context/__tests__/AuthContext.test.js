import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AuthContext, useAuth } from '../../context/AuthContext';

// Mock the ThemeContext
jest.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({
        isDarkMode: false,
        toggleDarkMode: jest.fn()
    })
}));

// Mock component for testing auth integration
const MockAuthComponent = ({ children }) => (
    <BrowserRouter>
        <AuthProvider>
            {children}
        </AuthProvider>
    </BrowserRouter>
);

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('should render children correctly', () => {
        render(
            <MockAuthComponent>
                <div>Test Content</div>
            </MockAuthComponent>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('should initialize with null user when no token in localStorage', () => {
        const TestComponent = () => {
            const { user } = React.useContext(AuthContext);
            return <div>{user ? 'Logged In' : 'Logged Out'}</div>;
        };

        render(
            <MockAuthComponent>
                <TestComponent />
            </MockAuthComponent>
        );

        expect(screen.getByText('Logged Out')).toBeInTheDocument();
    });

    test('should load user from localStorage if token exists', () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            full_name: 'Test User'
        };

        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));

        const TestComponent = () => {
            const { user } = React.useContext(AuthContext);
            return <div>{user ? user.email : 'No User'}</div>;
        };

        render(
            <MockAuthComponent>
                <TestComponent />
            </MockAuthComponent>
        );

        waitFor(() => {
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
        });
    });
});

describe('Authentication Hooks', () => {
    test('useAuth hook should provide auth context', () => {
        const TestComponent = () => {
            const auth = useAuth();
            return (
                <div>
                    <div>User: {auth.user ? auth.user.email : 'None'}</div>
                    <div>Loading: {auth.loading ? 'Yes' : 'No'}</div>
                </div>
            );
        };

        render(
            <MockAuthComponent>
                <TestComponent />
            </MockAuthComponent>
        );

        expect(screen.getByText(/User:/)).toBeInTheDocument();
        expect(screen.getByText(/Loading:/)).toBeInTheDocument();
    });
});

export { MockAuthComponent };
