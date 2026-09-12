import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import EmailIcon from '@mui/icons-material/Email'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { FIELD_REQUIRED_MESSAGE } from '../../utils/validators'
import FieldErrorAlert from '../../components/Form/FieldErrorAlert'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = () => {
    // Giả lập gửi email reset password
    toast.success('Reset password email has been sent!')
    navigate('/auth/login')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ 
          minWidth: 400, 
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
          }
        }}>
          <Box sx={{
            padding: '2.5em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2,
              marginBottom: 1
            }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 64,
                height: 64,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <EmailIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Typography sx={{
                fontWeight: 700,
                fontSize: '2rem',
                color: 'primary.main',
                letterSpacing: '0.5px'
              }}>Forgot Password</Typography>
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                textAlign: 'center',
                mb: 2
              }}
            >
              Enter your email address and we'll send you a link to reset your password.
            </Typography>

            <Box sx={{ width: '100%' }}>
              <TextField
                autoFocus
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                error={!!errors['email']}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: 'primary.main',
                      fontWeight: 500,
                    },
                  },
                }}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                py: 1.75,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                boxShadow: '0 4px 12px rgba(13, 71, 161, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                  boxShadow: '0 6px 16px rgba(13, 71, 161, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              Send Reset Link
            </Button>

            <Link to="/auth/login" style={{ textDecoration: 'none' }}>
              <Typography 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': { 
                    color: '#1a237e',
                    textDecoration: 'underline'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Back to Login
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default ForgotPassword 