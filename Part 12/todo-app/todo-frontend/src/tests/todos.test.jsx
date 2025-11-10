import { render, screen } from '@testing-library/react';
import TodoList from '../Todos/List';

describe('to-do view basic tests', () => {
  const mockTodos = [
    { _id: '1', text: 'o campeão tem nome', done: false },
    { _id: '2', text: 'se chama charles oliveira', done: true },
  ];

  beforeEach(() =>
    render(<TodoList todos={mockTodos} deleteTodo={vi.fn()} completeTodo={vi.fn()} />)
  );

  it('renders to-dos', () => {
    expect(screen.getByText('o campeão tem nome')).toBeInTheDocument();
    expect(screen.getByText('se chama charles oliveira')).toBeInTheDocument();
  });

  it('renders to-dos done state correctly', () => {
    expect(screen.getByText('This todo is not done')).toBeInTheDocument();
    expect(screen.getByText('This todo is done')).toBeInTheDocument();
  });

  it('renders set as done button', () => {
    expect(screen.queryByText('Set as done')).toBeTruthy();
  });
});
