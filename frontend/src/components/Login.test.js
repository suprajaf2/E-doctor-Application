import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';

// Mock axios
jest.mock('axios');

// Mock the `useNavigate` hook from React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });

  test('allows user to type into inputs and select a role', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const roleSelect = screen.getByLabelText('Role');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'Doctor' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(roleSelect.value).toBe('Doctor');
  });

  test('calls API and navigates to Doctor dashboard on successful login', async () => {
    axios.post.mockResolvedValue({ data: true });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const roleSelect = screen.getByLabelText('Role');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'doctor@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'Doctor' } });

    fireEvent.click(loginButton);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/loginUser', {
      userId: 'doctor@example.com',
      password: 'password123',
      userType: 'Doctor',
    });

    // Wait for navigation to happen
    await screen.findByText('Login'); // Wait for DOM updates
    expect(mockNavigate).toHaveBeenCalledWith('/Doctordashboard');
  });

  test('shows alert on failed login', async () => {
    axios.post.mockResolvedValue({ data: false });

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const roleSelect = screen.getByLabelText('Role');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'patient@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.change(roleSelect, { target: { value: 'Patient' } });

    fireEvent.click(loginButton);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/loginUser', {
      userId: 'patient@example.com',
      password: 'wrongpassword',
      userType: 'Patient',
    });

    await screen.findByText('Login'); // Wait for DOM updates
    expect(window.alert).toHaveBeenCalledWith(
      'Login unsuccessful. Please check your credentials.'
    );
  });

  test('alerts on forgot password click', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Forgot Password?'));

    expect(window.alert).toHaveBeenCalledWith(
      'Forgot password functionality not implemented yet.'
    );
  });
});
