import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Contact from '../pages/Contact';

// Mock navigate function
const mockNavigate = () => {};

describe('Contact Component', () => {
  it('should render contact form', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Contact navigate={mockNavigate} />
      </I18nextProvider>
    );
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/purpose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should have required form fields', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Contact navigate={mockNavigate} />
      </I18nextProvider>
    );
    
    const purposeField = screen.getByLabelText(/purpose/i);
    const nameField = screen.getByLabelText(/full name/i);
    const emailField = screen.getByLabelText(/email/i);
    const messageField = screen.getByLabelText(/message/i);
    
    expect(purposeField).toBeRequired();
    expect(nameField).toBeRequired();
    expect(emailField).toBeRequired();
    expect(messageField).toBeRequired();
  });
});