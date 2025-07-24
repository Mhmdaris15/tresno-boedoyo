import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Add,
  Person,
  Phone,
  Email,
  CalendarToday,
  LocationOn,
  Language,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/apiClient';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  volunteer?: VolunteerProfile;
  coordinator?: CoordinatorProfile;
}

interface VolunteerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  languages: string[];
  bio: string;
  profilePicture?: string;
  skills: Skill[];
}

interface CoordinatorProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  bio: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  category: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit states
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [skillDialog, setSkillDialog] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'BEGINNER', category: '' });

  const skillCategories = [
    'Heritage Preservation',
    'Research & Documentation',
    'Education & Outreach',
    'Technology',
    'Management',
    'Arts & Culture',
    'Language',
    'Other'
  ];

  const skillLevels = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
    { value: 'EXPERT', label: 'Expert' }
  ];

  const languages = [
    'Indonesian', 'English', 'Javanese', 'Sundanese', 'Batak', 'Minangkabau',
    'Balinese', 'Madurese', 'Chinese', 'Arabic', 'Dutch', 'German', 'French',
    'Spanish', 'Japanese', 'Korean', 'Other'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users/profile');
      setProfile(response.data.data);
      setEditedProfile(response.data.data);
    } catch (err: any) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await apiClient.put('/users/profile', editedProfile);
      setProfile(response.data.data);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      
      // Update user context
      updateUser(response.data.data);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.category) {
      const updatedSkills = [...(editedProfile.volunteer?.skills || []), {
        id: Date.now().toString(),
        ...newSkill
      }];
      
      setEditedProfile({
        ...editedProfile,
        volunteer: {
          ...editedProfile.volunteer,
          skills: updatedSkills
        }
      });
      
      setNewSkill({ name: '', level: 'BEGINNER', category: '' });
      setSkillDialog(false);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = editedProfile.volunteer?.skills?.filter((skill: Skill) => skill.id !== skillId) || [];
    setEditedProfile({
      ...editedProfile,
      volunteer: {
        ...editedProfile.volunteer,
        skills: updatedSkills
      }
    });
  };

  const handleProfileFieldChange = (field: string, value: any) => {
    if (profile?.role === 'VOLUNTEER') {
      setEditedProfile({
        ...editedProfile,
        volunteer: {
          ...editedProfile.volunteer,
          [field]: value
        }
      });
    } else if (profile?.role === 'COORDINATOR') {
      setEditedProfile({
        ...editedProfile,
        coordinator: {
          ...editedProfile.coordinator,
          [field]: value
        }
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography color="error">Failed to load profile</Typography>
        </Box>
      </Container>
    );
  }

  const currentProfile = profile.role === 'VOLUNTEER' ? profile.volunteer : profile.coordinator;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Profile</Typography>
        <Box>
          {editMode ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => {
                  setEditMode(false);
                  setEditedProfile(profile);
                }}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Basic Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={profile.role === 'VOLUNTEER' ? profile.volunteer?.profilePicture : undefined}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                >
                  <Person sx={{ fontSize: 60 }} />
                </Avatar>
                {editMode && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    size="small"
                  >
                    <PhotoCamera sx={{ color: 'white' }} />
                  </IconButton>
                )}
              </Box>

              {editMode ? (
                <>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={editedProfile.volunteer?.firstName || editedProfile.coordinator?.firstName || ''}
                    onChange={(e) => handleProfileFieldChange('firstName', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={editedProfile.volunteer?.lastName || editedProfile.coordinator?.lastName || ''}
                    onChange={(e) => handleProfileFieldChange('lastName', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {currentProfile?.firstName} {currentProfile?.lastName}
                </Typography>
              )}

              <Chip
                label={profile.role}
                color="primary"
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <List dense>
                <ListItem>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary={profile.email} />
                </ListItem>
                <ListItem>
                  <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText 
                    primary={editMode ? (
                      <TextField
                        fullWidth
                        value={editedProfile.volunteer?.phone || editedProfile.coordinator?.phone || ''}
                        onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                        size="small"
                      />
                    ) : (
                      currentProfile?.phone || 'Not provided'
                    )}
                  />
                </ListItem>
                {profile.role === 'VOLUNTEER' && (
                  <>
                    <ListItem>
                      <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                      <ListItemText 
                        primary={editMode ? (
                          <TextField
                            fullWidth
                            type="date"
                            value={editedProfile.volunteer?.dateOfBirth || ''}
                            onChange={(e) => handleProfileFieldChange('dateOfBirth', e.target.value)}
                            size="small"
                          />
                        ) : (
                          profile.volunteer?.dateOfBirth ? 
                            new Date(profile.volunteer.dateOfBirth).toLocaleDateString() : 
                            'Not provided'
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                      <ListItemText 
                        primary={editMode ? (
                          <TextField
                            fullWidth
                            value={editedProfile.volunteer?.nationality || ''}
                            onChange={(e) => handleProfileFieldChange('nationality', e.target.value)}
                            size="small"
                            placeholder="Nationality"
                          />
                        ) : (
                          profile.volunteer?.nationality || 'Not provided'
                        )}
                      />
                    </ListItem>
                  </>
                )}
                {profile.role === 'COORDINATOR' && (
                  <ListItem>
                    <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText 
                      primary={editMode ? (
                        <TextField
                          fullWidth
                          value={editedProfile.coordinator?.department || ''}
                          onChange={(e) => handleProfileFieldChange('department', e.target.value)}
                          size="small"
                          placeholder="Department"
                        />
                      ) : (
                        profile.coordinator?.department || 'Not provided'
                      )}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Languages - Only for Volunteers */}
          {profile.role === 'VOLUNTEER' && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Languages
                </Typography>
                {editMode ? (
                  <Autocomplete
                    multiple
                    options={languages}
                    value={editedProfile.volunteer?.languages || []}
                    onChange={(_, newValue) => handleProfileFieldChange('languages', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select languages"
                      />
                    )}
                  />
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.volunteer?.languages?.map((language) => (
                      <Chip key={language} label={language} size="small" />
                    )) || <Typography color="text.secondary">No languages added</Typography>}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Detailed Info */}
        <Grid item xs={12} md={8}>
          {/* Bio */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Bio</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editedProfile.volunteer?.bio || editedProfile.coordinator?.bio || ''}
                  onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                  placeholder="Tell us about yourself, your interests in heritage preservation, and your goals..."
                />
              ) : (
                <Typography color="text.secondary">
                  {currentProfile?.bio || 'No bio provided yet.'}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Skills Section - Only for Volunteers */}
          {profile.role === 'VOLUNTEER' && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Skills</Typography>
                  {editMode && (
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => setSkillDialog(true)}
                      size="small"
                    >
                      Add Skill
                    </Button>
                  )}
                </Box>
                
                {(editedProfile.volunteer?.skills || []).length === 0 ? (
                  <Typography color="text.secondary">No skills added yet.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(editedProfile.volunteer?.skills || []).map((skill: Skill) => (
                      <Chip
                        key={skill.id}
                        label={`${skill.name} (${skill.level})`}
                        color="primary"
                        variant="outlined"
                        onDelete={editMode ? () => handleRemoveSkill(skill.id) : undefined}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Add Skill Dialog */}
      <Dialog open={skillDialog} onClose={() => setSkillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              label="Category"
            >
              {skillCategories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
              label="Level"
            >
              {skillLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkillDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSkill} variant="contained">Add Skill</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
