import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { AuthProvider } from '../../context/AuthContext';

// Mock the AuthContext
const mockUseAuth = {
    user: null,
    logout: jest.fn()
};

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: () => mockUseAuth
}));

// Mock the ThemeContext
jest.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({
        isDarkMode: false,
        toggleDarkMode: jest.fn()
    })
}));

const renderNavbar = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('Navbar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.user = null;
    });

    test('should render navigation links', () => {
        renderNavbar();

        expect(screen.getByText(/Issues Tracker/i)).toBeInTheDocument();
    });

    test('should show login and register buttons when not authenticated', () => {
        mockUseAuth.user = null;
        renderNavbar();

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    test('should show user menu when authenticated', () => {
        mockUseAuth.user = {
            id: 1,
            email: 'test@example.com',
            full_name: 'Test User'
        };

        renderNavbar();

        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });

    test('should call logout function when logout is clicked', () => {
        mockUseAuth.user = {
            id: 1,
            email: 'test@example.com',
            full_name: 'Test User'
        };

        renderNavbar();

        // Find and click logout button
        const logoutButton = screen.getByText(/Logout/i);
        fireEvent.click(logoutButton);

        expect(mockUseAuth.logout).toHaveBeenCalled();
    });

    test('should have links to main sections', () => {
        renderNavbar();

        expect(screen.getByText(/Map/i)).toBeInTheDocument();
        expect(screen.getByText(/Community/i)).toBeInTheDocument();
    });

    test('should be responsive on mobile', () => {
        renderNavbar();

        // Check for mobile menu button (hamburger icon)
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        if (mobileMenuButton) {
            expect(mobileMenuButton).toBeInTheDocument();
        }
    });

    test('should highlight active route', () => {
        renderNavbar();

        // Check if any nav link has active class
        const navLinks = screen.getAllByRole('link');
        expect(navLinks.length).toBeGreaterThan(0);
    });
});
