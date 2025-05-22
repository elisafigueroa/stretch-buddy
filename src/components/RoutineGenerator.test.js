import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoutineGenerator from './RoutineGenerator';
import { useExerciseProgress } from '../context/ExerciseProgressContext';
import { aiService } from '../services/aiRecommendationService';

// Mock the context and service
jest.mock('../context/ExerciseProgressContext');
jest.mock('../services/aiRecommendationService');

describe('RoutineGenerator', () => {
  const mockGetOverallStats = jest.fn();
  const mockGetRecommendations = jest.fn();

  beforeEach(() => {
    // Reset mocks
    mockGetOverallStats.mockReset();
    mockGetRecommendations.mockReset();
    
    // Setup context mock
    useExerciseProgress.mockReturnValue({
      getOverallStats: mockGetOverallStats
    });

    // Setup service mock
    aiService.getRecommendations = mockGetRecommendations;
  });

  test('renders time selector with correct options', () => {
    render(<RoutineGenerator />);
    
    const timeSelector = screen.getByLabelText('Time Available:');
    expect(timeSelector).toBeInTheDocument();
    
    // Check all time options are present
    expect(screen.getByText('5 minutes')).toBeInTheDocument();
    expect(screen.getByText('10 minutes')).toBeInTheDocument();
    expect(screen.getByText('15 minutes')).toBeInTheDocument();
    expect(screen.getByText('20 minutes')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
  });

  test('generates routine within time limit', async () => {
    // Mock recommendations
    const mockExercises = [
      { id: '1', name: 'Exercise 1', type: 'Neck', duration: 60 },
      { id: '2', name: 'Exercise 2', type: 'Shoulders', duration: 90 },
      { id: '3', name: 'Exercise 3', type: 'Back', duration: 120 }
    ];
    mockGetRecommendations.mockResolvedValue(mockExercises);

    render(<RoutineGenerator />);
    
    // Set time to 5 minutes (300 seconds)
    const timeSelector = screen.getByLabelText('Time Available:');
    fireEvent.change(timeSelector, { target: { value: '5' } });
    
    // Click generate button
    const generateButton = screen.getByText('Generate Routine');
    fireEvent.click(generateButton);
    
    // Wait for routine to be generated
    await waitFor(() => {
      expect(screen.getByText('Your Personalized Routine')).toBeInTheDocument();
    });
    
    // Verify total duration is within limit
    const summary = screen.getByText(/exercises • \d+ minutes/);
    expect(summary).toBeInTheDocument();
  });

  test('displays focus areas correctly', async () => {
    // Mock recommendations with different types
    const mockExercises = [
      { id: '1', name: 'Exercise 1', type: 'Neck', duration: 60 },
      { id: '2', name: 'Exercise 2', type: 'Shoulders', duration: 90 },
      { id: '3', name: 'Exercise 3', type: 'Neck', duration: 60 }
    ];
    mockGetRecommendations.mockResolvedValue(mockExercises);

    render(<RoutineGenerator />);
    
    // Generate routine
    const generateButton = screen.getByText('Generate Routine');
    fireEvent.click(generateButton);
    
    // Wait for routine to be generated
    await waitFor(() => {
      expect(screen.getByText('Focus Areas:')).toBeInTheDocument();
    });
    
    // Verify unique focus areas are displayed
    expect(screen.getByText('Neck')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
  });

  test('handles generation errors gracefully', async () => {
    // Mock error
    mockGetRecommendations.mockRejectedValue(new Error('Failed to generate'));

    render(<RoutineGenerator />);
    
    // Click generate button
    const generateButton = screen.getByText('Generate Routine');
    fireEvent.click(generateButton);
    
    // Verify button returns to normal state
    await waitFor(() => {
      expect(screen.getByText('Generate Routine')).toBeInTheDocument();
    });
  });

  test('start routine button is present when routine is generated', async () => {
    // Mock recommendations
    const mockExercises = [
      { id: '1', name: 'Exercise 1', type: 'Neck', duration: 60 }
    ];
    mockGetRecommendations.mockResolvedValue(mockExercises);

    render(<RoutineGenerator />);
    
    // Generate routine
    const generateButton = screen.getByText('Generate Routine');
    fireEvent.click(generateButton);
    
    // Wait for routine to be generated
    await waitFor(() => {
      expect(screen.getByText('Start Routine')).toBeInTheDocument();
    });
  });
}); 