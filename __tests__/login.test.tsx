import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/auth/login/page'
import { authAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// Mock API
jest.mock('@/lib/api', () => ({
    authAPI: {
        login: jest.fn(),
    },
}))

describe('LoginPage', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        })
        jest.clearAllMocks()
    })

    it('renders login form', () => {
        render(<LoginPage />)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
    })

    it('handles successful login', async () => {
        (authAPI.login as jest.Mock).mockResolvedValue({
            data: {
                token: 'fake-token',
                user: { role: 'admin' },
            },
        })

        render(<LoginPage />)

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } })
        fireEvent.click(screen.getByRole('button', { name: /masuk/i }))

        await waitFor(() => {
            expect(authAPI.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password',
            })
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('handles login error', async () => {
        (authAPI.login as jest.Mock).mockRejectedValue({
            response: {
                data: {
                    error: 'Invalid credentials',
                },
            },
        })

        render(<LoginPage />)

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })
        fireEvent.click(screen.getByRole('button', { name: /masuk/i }))

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
        })
    })
})
