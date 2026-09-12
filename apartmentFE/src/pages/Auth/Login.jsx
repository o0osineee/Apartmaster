import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { FIELD_REQUIRED_MESSAGE } from '../../utils/validators'
import FieldErrorAlert from '../../components/Form/FieldErrorAlert'
import { toast } from 'react-toastify'
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice'
import api from '../../api/config'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitLogIn = async (data) => {
    try {
      dispatch(loginStart())
      const response = await api.post('/auth/login', data)
      dispatch(loginSuccess(response.data.data))
      
      // Redirect based on userType only
      const { userType } = response.data.data.user
      if (userType === 'employee') {
        navigate('/admin')
      } else {
        navigate('/client')
      }
      
      toast.success('Đăng nhập thành công!')
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Đăng nhập thất bại'))
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
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
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockIcon />
            </Avatar>
            
            <Typography variant="h4" component="h1" gutterBottom>
              Đăng nhập
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Tên đăng nhập"
              {...register('username', { required: FIELD_REQUIRED_MESSAGE })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              fullWidth
              type="password"
              label="Mật khẩu"
              {...register('password', { required: FIELD_REQUIRED_MESSAGE })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default Login
