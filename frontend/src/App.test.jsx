import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import App from './App';

describe('App component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  /**
   * #1 Testet das Rendern der Überschrift.
   */
  test('renders heading', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { name: /ToDo Liste/i });
    expect(headingElement).toBeInTheDocument();
  });

  /**
   * #2 Testet das Hinzufügen einer Aufgabe.
   */
  test('allows user to add a new task', async () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/Enter new Task/i);
    const addButtonElement = screen.getByRole('button', { name: /Save/i });

    const taskName = 'Buy_groceries';
    fireEvent.change(inputElement, { target: { value: taskName } });
    fireEvent.click(addButtonElement);

    await waitFor(() => {
      const newTaskElement = screen.getByText(/Buy_groceries/);
      expect(newTaskElement).toBeInTheDocument();
    });
  });

  /**
   * #3 Überprüft, ob die Komponente nach dem Rendern die korrekten Startzustände aufweist.
   */
  test('renders with initial state', () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/Enter new Task/i);
    const addButtonElement = screen.getByRole('button', { name: /Save/i });

    expect(inputElement).toHaveValue('');
    expect(addButtonElement).toBeInTheDocument();
    expect(screen.queryByText(/Task 1:/)).not.toBeInTheDocument();
  });

  /**
   * #4 Überprüft, ob das Hinzufügen mehrerer Aufgaben nacheinander korrekt funktioniert.
   */
  test('allows user to add multiple tasks', async () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/Enter new Task/i);
    const addButtonElement = screen.getByRole('button', { name: /Save/i });

    const task1Name = 'Buy_groceries';
    fireEvent.change(inputElement, { target: { value: task1Name } });
    fireEvent.click(addButtonElement);

    const task2Name = 'Do_laundry';
    fireEvent.change(inputElement, { target: { value: task2Name } });
    fireEvent.click(addButtonElement);

    render(<App />); // Optional: Neuladen simulieren

    await waitFor(() => {
      const newTaskElement = screen.getByText(/Task 1: Buy_groceries/);
      expect(newTaskElement).toBeInTheDocument();
    });

    const newTaskElement2 = screen.getByText(/Task 2: Do_laundry/);
    expect(newTaskElement2).toBeInTheDocument();
  });
});
