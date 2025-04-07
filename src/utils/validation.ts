import { z } from 'zod'

export const emailSchema = z.string().email()

export const passwordSchema = z
  .string()
  .min(8, { message: 'Mật khẩu phải dài ít nhất 8 kí tự' })
  .max(32, { message: 'Mật khẩu không được quá 32 kí tự' })
  .refine(value => /[a-z]/.test(value), { message: 'Mật khẩu phải bao gồm ít nhất 1 chữ cái thường' })
  .refine(value => /[A-Z]/.test(value), { message: 'Mật khẩu phải bao gồm ít nhất 1 chữ cái hoa' })
  .refine(value => /\d/.test(value), { message: 'Mật khẩu phải bao gồm ít nhất 1 số' })
  // .refine(value => /[@$!%*?&]/.test(value), { message: 'Password must include at least one special character (@$!%*?&)' })

export const requiredStringSchema = z.string()

export const signupValidator = z
  .object({
    email: emailSchema,
    name: requiredStringSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const emailValidator = z.object({
  email: emailSchema,
})

export const loginValidator = z.object({
  email: emailSchema,
  password: requiredStringSchema,
})

export const resetPasswordValidator = z
  .object({
    token: requiredStringSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
