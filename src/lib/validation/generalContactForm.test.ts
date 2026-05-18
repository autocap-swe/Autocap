import { generalContactFormSchema, type GeneralContactFormData } from './generalContactForm';

describe('General Contact Form Validation Schema', () => {
  describe('AC-006: Required fields validation', () => {
    it('rejects form when name is empty', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('rejects form when email is empty', () => {
      const invalidData = {
        name: 'John Doe',
        email: '',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('rejects form when subject is empty', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: '',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('subject');
      }
    });

    it('rejects form when message is empty', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: '',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });
  });

  describe('AC-007: Email format validation', () => {
    it('rejects invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email');
      }
    });

    it('rejects email without @', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'testexample.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts valid email format', () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('AC-008: GDPR consent validation', () => {
    it('rejects form when GDPR consent is false', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: false,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('gdprConsent');
      }
    });

    it('rejects form when GDPR consent is missing', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts form when GDPR consent is true', () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('AC-018: Character limits', () => {
    it('rejects subject longer than 200 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'a'.repeat(201),
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('subject');
      }
    });

    it('accepts subject at exactly 200 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'a'.repeat(200),
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects message longer than 2000 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'a'.repeat(2001),
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('accepts message at exactly 2000 characters', () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Test',
        message: 'a'.repeat(2000),
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects name longer than 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });
  });

  describe('Valid form data', () => {
    it('accepts completely valid form data', () => {
      const validData: GeneralContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Partnership Inquiry',
        message: 'I would like to discuss a potential partnership opportunity.',
        gdprConsent: true,
      };

      const result = generalContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });

  describe('Bug 1: Special characters and numbers in Name and Subject', () => {
    it('rejects name with numbers', () => {
      const result = generalContactFormSchema.safeParse({
        name: 'John123',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('rejects name with special characters', () => {
      const result = generalContactFormSchema.safeParse({
        name: 'John@Doe!',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(false);
    });

    it('accepts name with letters, spaces, hyphens and apostrophes', () => {
      const result = generalContactFormSchema.safeParse({
        name: "Anna-Maria O'Brien",
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(true);
    });

    it('accepts name with Nordic characters', () => {
      const result = generalContactFormSchema.safeParse({
        name: 'Åsa Björk',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects subject with HTML-dangerous characters', () => {
      const result = generalContactFormSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        subject: '<script>alert(1)</script>',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('subject');
      }
    });

    it('accepts subject with numbers and normal punctuation', () => {
      const result = generalContactFormSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Question about order #123 - urgent!',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Bug 2: Blank spaces validation', () => {
    it('rejects name with only spaces', () => {
      const result = generalContactFormSchema.safeParse({
        name: '   ',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('rejects subject with only spaces', () => {
      const result = generalContactFormSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        subject: '   ',
        message: 'Test message',
        gdprConsent: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('subject');
      }
    });
  });
});
