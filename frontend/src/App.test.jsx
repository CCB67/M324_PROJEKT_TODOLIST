import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';


/* ──────────────────────────────────────────────────────────
   Fetch‑Mock:  • POST  → erzeugt Task‑Objekt mit taskdescription
                • DELETE → ok
                • GET   → leere Liste
   ────────────────────────────────────────────────────────── */
let mockId = 1;

beforeEach(() => {
  cleanup();
  mockId = 1;

  global.fetch = vi.fn((url, options = {}) => {
    // --- POST /api/tasks --------------------------------------------------
    if (options.method === 'POST') {
      const body = JSON.parse(options.body);

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: mockId++,                    // laufende IDs
            taskdescription: body.taskdescription,
            done: body.done,
          }),
      });
    }

    // --- DELETE /api/tasks/{id} ------------------------------------------
    if (options.method === 'DELETE') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve() });
    }

    // --- GET  /api/tasks --------------------------------------------------
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),       // Start: keine Tasks
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

/* ──────────────────────────────────────────────────────────
   Test‑Cases
   ────────────────────────────────────────────────────────── */
describe('App component', () => {
  it('renders heading', async () => {
    await act(async () => render(<App />));
    expect(
      screen.getByRole('heading', { name: /ToDo Liste/i }),
    ).toBeInTheDocument();
  });

  it('renders with initial state', async () => {
    await act(async () => render(<App />));

    expect(screen.getByLabelText('Neues Todo anlegen:')).toHaveValue('');
    expect(
      screen.getByRole('button', { name: /Absenden/i }),
    ).toBeInTheDocument();
  });

  it('allows user to add a new task', async () => {
    await act(async () => render(<App />));

    fireEvent.change(
      screen.getByLabelText('Neues Todo anlegen:'),
      { target: { value: 'Buy_groceries' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Absenden/i }));

    await waitFor(() => {
      expect(screen.getByText('Buy_groceries')).toBeInTheDocument();
    });
  });

  it('allows user to add multiple tasks', async () => {
    await act(async () => render(<App />));

    fireEvent.change(
      screen.getByLabelText('Neues Todo anlegen:'),
      { target: { value: 'Buy_groceries' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Absenden/i }));

    fireEvent.change(
      screen.getByLabelText('Neues Todo anlegen:'),
      { target: { value: 'Do_laundry' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Absenden/i }));

    await waitFor(() => {
      expect(screen.getByText('Buy_groceries')).toBeInTheDocument();
      expect(screen.getByText('Do_laundry')).toBeInTheDocument();
    });
  });

  it('allows user to delete a task', async () => {
    await act(async () => render(<App />));

    // Task anlegen
    fireEvent.change(
      screen.getByLabelText('Neues Todo anlegen:'),
      { target: { value: 'TaskA' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /Absenden/i }));

    // Warten bis Task sichtbar
    await waitFor(() => {
      expect(screen.getByText('TaskA')).toBeInTheDocument();
    });

    // Ersten Delete‑Button klicken
    fireEvent.click(screen.getAllByLabelText('Löschen')[0]);

    // Task darf nicht mehr existieren
    await waitFor(() => {
      expect(screen.queryByText('TaskA')).toBeNull();
    });
  });
});