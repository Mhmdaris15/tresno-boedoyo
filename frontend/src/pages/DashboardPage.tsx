import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Person,
  Event,
  EmojiEvents,
  Add,
  LocationOn,
  AccessTime,
  Group,
  Phone,
  Email,
  Edit,
  Notifications,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/apiClient';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  volunteersNeeded: number;
  registeredVolunteers: number;
  skills: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  type: 'PARTICIPATION' | 'HOURS' | 'LEADERSHIP' | 'SPECIAL';
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalVolunteerHours: 0,
    eventsParticipated: 0,
    impactScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch opportunities
      const opportunitiesResponse = await apiClient.get('/opportunities');
      setOpportunities(opportunitiesResponse.data);

      // Fetch user achievements
      const achievementsResponse = await apiClient.get('/achievements');
      setAchievements(achievementsResponse.data);

      // Fetch user stats
      const statsResponse = await apiClient.get('/users/stats');
      setStats(statsResponse.data);

    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'PARTICIPATION': return 'primary';
      case 'HOURS': return 'secondary';
      case 'LEADERSHIP': return 'success';
      case 'SPECIAL': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Welcome back, {user?.volunteer?.firstName || user?.coordinator?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to make a difference in Indonesia's heritage preservation?
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Profile & Stats */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                >
                  <Person fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {user?.volunteer?.firstName} {user?.volunteer?.lastName}
                  </Typography>
                  <Chip
                    label={user?.role}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <IconButton sx={{ ml: 'auto' }}>
                  <Edit />
                </IconButton>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={user?.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={user?.volunteer?.phone || 'Not provided'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={user?.volunteer?.location || 'Not provided'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AccessTime color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {stats.totalVolunteerHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Volunteer Hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Event color="secondary" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="h5" color="secondary">
                    {stats.eventsParticipated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp color="success" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="h5" color="success">
                    {stats.impactScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Impact Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Middle Column - Opportunities */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Available Opportunities</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                size="small"
              >
                Browse All
              </Button>
            </Box>

            {opportunities.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No opportunities available at the moment.
              </Typography>
            ) : (
              opportunities.slice(0, 3).map((opportunity) => (
                <Card key={opportunity.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {opportunity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {opportunity.description.substring(0, 120)}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {opportunity.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {formatDate(opportunity.date)}
                      </Typography>
                      <Group fontSize="small" color="action" sx={{ ml: 2, mr: 0.5 }} />
                      <Typography variant="body2">
                        {opportunity.registeredVolunteers}/{opportunity.volunteersNeeded}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {opportunity.skills.slice(0, 3).map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      disabled={opportunity.registeredVolunteers >= opportunity.volunteersNeeded}
                    >
                      {opportunity.registeredVolunteers >= opportunity.volunteersNeeded 
                        ? 'Full' 
                        : 'Apply Now'
                      }
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* Right Column - Achievements & Notifications */}
        <Grid item xs={12} md={3}>
          {/* Achievements */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Achievements</Typography>
            </Box>
            
            {achievements.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Complete your first volunteer activity to earn achievements!
              </Typography>
            ) : (
              achievements.slice(0, 4).map((achievement) => (
                <Box key={achievement.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Chip
                      label={achievement.type}
                      size="small"
                      color={getAchievementColor(achievement.type) as any}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(achievement.earnedAt)}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2">
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                  {achievement !== achievements[achievements.length - 1] && (
                    <Divider sx={{ mt: 1.5 }} />
                  )}
                </Box>
              ))
            )}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Event />}
                fullWidth
              >
                My Events
              </Button>
              <Button
                variant="outlined"
                startIcon={<Person />}
                fullWidth
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Notifications />}
                fullWidth
              >
                Notifications
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
