import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
  LocationOn,
  Work,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  skills: string;
  interests: string;
  role: 'volunteer' | 'coordinator';
  agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    skills: '',
    interests: '',
    role: 'volunteer',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: keyof RegisterData) => (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      agreeToTerms: e.target.checked,
    });
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms and Conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Join Tresno Boedoyo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your volunteer account
            </Typography>
          </Box>

          <Divider sx={{ width: '100%', mb: 3 }} />

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Account Type */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">I want to join as</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                label="I want to join as"
                onChange={handleSelectChange}
              >
                <MenuItem value="volunteer">Volunteer</MenuItem>
                <MenuItem value="coordinator">Event Coordinator</MenuItem>
              </Select>
            </FormControl>

            {/* Name Fields */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
              />
            </Box>

            {/* Email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Phone */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Location */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label="Location (City, Indonesia)"
              name="location"
              value={formData.location}
              onChange={handleChange('location')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Fields */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Skills and Interests */}
            <TextField
              margin="normal"
              fullWidth
              id="skills"
              label="Skills (e.g., Photography, Event Management, Translation)"
              name="skills"
              multiline
              rows={2}
              value={formData.skills}
              onChange={handleChange('skills')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              id="interests"
              label="Interests (e.g., Cultural Heritage, Education, Community Outreach)"
              name="interests"
              multiline
              rows={2}
              value={formData.interests}
              onChange={handleChange('interests')}
            />

            {/* Terms and Conditions */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleCheckboxChange}
                  name="agreeToTerms"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" color="primary">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="#" color="primary">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ width: '100%', my: 3 }} />

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 500 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
