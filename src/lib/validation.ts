import { z } from 'zod';

// ── Contact form validation ──────────────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  insuranceType: z.string().optional(),
});

// ── Chat message validation ──────────────────────────────────────────────────
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  profile: z.object({}).passthrough().optional(),
  history: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
});

// ── Admin login validation ───────────────────────────────────────────────────
export const adminLoginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

// ── Review submission validation ─────────────────────────────────────────────
export const reviewSchema = z.object({
  productName: z.string().min(1).max(200),
  insuranceType: z.enum(['health', 'life', 'motor', 'travel', 'home']),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
  reviewerName: z.string().min(2).max(100),
  reviewerEmail: z.string().email(),
  reviewerPhone: z.string().optional(),
});

// ── Vote validation ──────────────────────────────────────────────────────────
export const voteSchema = z.object({
  voteType: z.enum(['helpful', 'not_helpful']),
});

// ── Lead status update validation ────────────────────────────────────────────
export const leadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']),
});

// ── Lead note validation ─────────────────────────────────────────────────────
export const leadNoteSchema = z.object({
  content: z.string().min(1).max(2000),
});

// ── Settings validation ──────────────────────────────────────────────────────
export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  description: z.string().optional(),
});

// ── Change password validation ───────────────────────────────────────────────
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
});

// ── User creation validation ─────────────────────────────────────────────────
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
  role: z.enum(['ADMIN', 'MODERATOR']),
});

// ── Sanitize string input (strip HTML tags) ──────────────────────────────────
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

// ── Generic validation helper ────────────────────────────────────────────────
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors.map(e => e.message) };
}
