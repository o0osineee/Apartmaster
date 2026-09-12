export const EMAIL_RULE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const EMAIL_RULE_MESSAGE = 'Invalid email address'
export const FIELD_REQUIRED_MESSAGE = 'This field is required'
export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
export const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Passwords do not match' 
export const PASSWORD_CONFIRMATION_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
export const PASSWORD_CONFIRMATION_RULE_MESSAGE = 'Passwords do not match' 