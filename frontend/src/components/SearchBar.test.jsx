import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  test('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    expect(screen.getByPlaceholderText('Search for products...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  test('calls onSearch when form is submitted', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText('Search for products...')
    const button = screen.getByRole('button', { name: /search/i })
    
    await user.type(input, 'headphones')
    await user.click(button)
    
    expect(mockOnSearch).toHaveBeenCalledWith('headphones')
  })

  test('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText('Search for products...')
    
    await user.type(input, 'laptop{enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('laptop')
  })

  test('does not call onSearch with empty query', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const button = screen.getByRole('button', { name: /search/i })
    
    await user.click(button)
    
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  test('does not call onSearch with whitespace-only query', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText('Search for products...')
    const button = screen.getByRole('button', { name: /search/i })
    
    await user.type(input, '   ')
    await user.click(button)
    
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  test('disables input and button when disabled prop is true', () => {
    render(<SearchBar onSearch={mockOnSearch} disabled={true} />)
    
    const input = screen.getByPlaceholderText('Search for products...')
    const button = screen.getByRole('button', { name: /search/i })
    
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  test('shows search tips', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    expect(screen.getByText(/Try searching for:/)).toBeInTheDocument()
    expect(screen.getByText(/headphones, phone, laptop, camera/)).toBeInTheDocument()
  })

  test('trims whitespace from search query', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText('Search for products...')
    
    await user.type(input, '  wireless headphones  {enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('wireless headphones')
  })
}) 