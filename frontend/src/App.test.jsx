import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';

let mockId = 1;

beforeEach(() => {
  mockId = 1; // Reset ID before each test
  global.fetch = vi.fn((url, options) => {
    if (options?.method === 'POST') {
      const body = JSON.parse(options.body);
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: mockId++, // use consecutive ID
            ...body,
          }),
      });
    }

    // GET-Fallback
    return Promise.resolve({
      json: () => Promise.resolve([]),
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App component', () => {
  it('renders heading', async () => {
    await act(async () => {
      render(<App />);
    });
    const headingElement = screen.getByRole('heading', { name: /ToDo Liste/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders with initial state', async () => {
    await act(async () => {
      render(<App />);
    });
    const inputElement = screen.getByLabelText('Neues Todo anlegen:');
    const addButtonElement = screen.getByRole('button', { name: /Absenden/i });

    expect(inputElement).toHaveValue('');
    expect(addButtonElement).toBeInTheDocument();
  });

  it('allows user to add a new task', async () => {
    await act(async () => {
      render(<App />);
    });
    const inputElement = screen.getByLabelText('Neues Todo anlegen:');
    const addButtonElement = screen.getByRole('button', { name: /Absenden/i });

    fireEvent.change(inputElement, { target: { value: 'Buy_groceries' } });
    fireEvent.click(addButtonElement);

    await waitFor(() => {
      expect(screen.getByText(/Buy_groceries/)).toBeInTheDocument();
    });
  });

  it('allows user to add multiple tasks', async () => {
    await act(async () => {
      render(<App />);
    });
    const inputElement = screen.getByLabelText('Neues Todo anlegen:');
    const addButtonElement = screen.getByRole('button', { name: /Absenden/i });

    fireEvent.change(inputElement, { target: { value: 'Buy_groceries' } });
    fireEvent.click(addButtonElement);

    fireEvent.change(inputElement, { target: { value: 'Do_laundry' } });
    fireEvent.click(addButtonElement);

    await waitFor(() => {
      expect(screen.getByText(/Buy_groceries/)).toBeInTheDocument();
      expect(screen.getByText(/Do_laundry/)).toBeInTheDocument();
    });
  });
});
