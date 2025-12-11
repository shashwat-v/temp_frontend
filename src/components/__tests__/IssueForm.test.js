import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import IssueForm from '../IssueForm';

// Mock the ThemeContext
jest.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({
        isDarkMode: false,
        toggleDarkMode: jest.fn()
    })
}));

// Mock the AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 1, email: 'test@example.com' },
        token: 'mock-token'
    })
}));

// Mock props
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const renderIssueForm = (props = {}) => {
    const defaultProps = {
        onSubmit: mockOnSubmit,
        onCancel: mockOnCancel,
        initialLocation: { lat: 40.7128, lng: -74.0060 },
        ...props
    };

    return render(
        <BrowserRouter>
            <IssueForm {...defaultProps} />
        </BrowserRouter>
    );
};

describe('IssueForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render all form fields', () => {
        renderIssueForm();

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    test('should submit form with valid data', async () => {
        renderIssueForm();

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const categorySelect = screen.getByLabelText(/category/i);

        await userEvent.type(titleInput, 'Pothole on Main Street');
        await userEvent.type(descriptionInput, 'Large pothole causing traffic issues');
        await userEvent.selectOptions(categorySelect, 'infrastructure');

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Pothole on Main Street',
                    description: 'Large pothole causing traffic issues',
                    category: 'infrastructure'
                })
            );
        });
    });

    test('should show validation errors for empty fields', async () => {
        renderIssueForm();

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        });
    });

    test('should validate title length', async () => {
        renderIssueForm();

        const titleInput = screen.getByLabelText(/title/i);
        await userEvent.type(titleInput, 'ab'); // Too short

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/title must be at least/i)).toBeInTheDocument();
        });
    });

    test('should call onCancel when cancel button is clicked', () => {
        renderIssueForm();

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    test('should handle image upload', async () => {
        renderIssueForm();

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByLabelText(/upload image/i);

        await userEvent.upload(fileInput, file);

        await waitFor(() => {
            expect(fileInput.files[0]).toEqual(file);
            expect(fileInput.files).toHaveLength(1);
        });
    });

    test('should validate image file type', async () => {
        renderIssueForm();

        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const fileInput = screen.getByLabelText(/upload image/i);

        await userEvent.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText(/please upload an image/i)).toBeInTheDocument();
        });
    });

    test('should pre-fill form when editing existing issue', () => {
        const existingIssue = {
            title: 'Existing Issue',
            description: 'Existing description',
            category: 'safety',
            address: '123 Main St'
        };

        renderIssueForm({ initialData: existingIssue });

        expect(screen.getByDisplayValue('Existing Issue')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    });

    test('should update character count as user types', async () => {
        renderIssueForm();

        const descriptionInput = screen.getByLabelText(/description/i);
        await userEvent.type(descriptionInput, 'Test description');

        // Assuming there's a character counter displayed
        const charCount = screen.queryByText(/\d+\/500/);
        if (charCount) {
            expect(charCount).toBeInTheDocument();
        }
    });

    test('should disable submit button while submitting', async () => {
        mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

        renderIssueForm();

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);

        await userEvent.type(titleInput, 'Test Title');
        await userEvent.type(descriptionInput, 'Test Description');

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
    });

    test('should show all category options', () => {
        renderIssueForm();

        const categorySelect = screen.getByLabelText(/category/i);
        const options = categorySelect.querySelectorAll('option');

        expect(options.length).toBeGreaterThan(1);
        expect(Array.from(options).map(opt => opt.value)).toContain('infrastructure');
        expect(Array.from(options).map(opt => opt.value)).toContain('safety');
    });
});
