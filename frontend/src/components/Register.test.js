import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Register from './Register';

// Mock axios
jest.mock('axios');

// Mock the `useNavigate` hook from React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders the registration form correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('allows user to type into form fields and select a role', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const roleSelect = screen.getByLabelText('Role');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'Doctor' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
    expect(roleSelect.value).toBe('Doctor');
  });

  test('shows alert if passwords do not match', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const registerButton = screen.getByText('Register');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(registerButton);

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
  });

  test('calls API and navigates to login on successful registration', async () => {
    axios.post.mockResolvedValue({ data: { message: 'User registered successfully!' } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const roleSelect = screen.getByLabelText('Role');
    const registerButton = screen.getByText('Register');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'Patient' } });

    fireEvent.click(registerButton);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/addUser', {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      userType: 'Patient',
    });

    await screen.findByText('Register'); // Wait for DOM updates
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays error message on API failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Email already in use' } } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const roleSelect = screen.getByLabelText('Role');
    const registerButton = screen.getByText('Register');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'Patient' } });

    fireEvent.click(registerButton);

    await screen.findByText('Email already in use'); // Wait for message
    expect(screen.getByText('Email already in use')).toBeInTheDocument();
  });
});
