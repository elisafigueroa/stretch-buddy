import * as tf from '@tensorflow/tfjs';

class AIRecommendationService {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.featureSize = 10; // Number of features we track per exercise
    this.trainingHistory = [];
    this.lastPredictions = [];
  }

  async initialize() {
    try {
      // Create a simple neural network
      this.model = tf.sequential();
      
      // Add layers
      this.model.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        inputShape: [this.featureSize]
      }));
      
      this.model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
      }));
      
      this.model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      }));
      
      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });
      
      this.isModelLoaded = true;
      console.log('AI model initialized successfully');
    } catch (error) {
      console.error('Error initializing AI model:', error);
      this.isModelLoaded = false;
    }
  }

  // Add debug logging for feature preparation
  prepareFeatures(exercise, userStats) {
    const features = [
      exercise.difficulty === 'gentle' ? 1 : 0,
      exercise.difficulty === 'moderate' ? 1 : 0,
      exercise.difficulty === 'advanced' ? 1 : 0,
      userStats.averageSoreness / 5,
      userStats.dailyStreak / 30,
      userStats.missedSessions / 10,
      exercise.duration / 600,
      userStats.exerciseStreak[exercise.type] / 10 || 0,
      userStats.lastExerciseType === exercise.type ? 1 : 0,
      userStats.preferredDifficulty === exercise.difficulty ? 1 : 0
    ];

    // Log feature values for debugging
    console.debug('Feature values:', {
      exercise: exercise.id,
      difficulty: exercise.difficulty,
      soreness: userStats.averageSoreness,
      streak: userStats.dailyStreak,
      missed: userStats.missedSessions,
      duration: exercise.duration,
      typeStreak: userStats.exerciseStreak[exercise.type] || 0,
      sameType: userStats.lastExerciseType === exercise.type,
      preferredMatch: userStats.preferredDifficulty === exercise.difficulty
    });

    return tf.tensor2d([features]);
  }

  // Enhanced getRecommendations with debugging
  async getRecommendations(exercises, userStats) {
    if (!this.isModelLoaded) {
      await this.initialize();
    }

    try {
      // Prepare features for all exercises
      const features = exercises.map(exercise => 
        this.prepareFeatures(exercise, userStats)
      );

      // Get predictions for all exercises
      const predictions = await Promise.all(
        features.map(async (feature) => {
          const prediction = await this.model.predict(feature).data();
          return prediction[0];
        })
      );

      // Store predictions for debugging
      this.lastPredictions = predictions;

      // Combine exercises with their AI scores
      const scoredExercises = exercises.map((exercise, index) => ({
        ...exercise,
        aiScore: predictions[index]
      }));

      // Log recommendation details
      console.debug('AI Recommendations:', scoredExercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        score: ex.aiScore,
        difficulty: ex.difficulty
      })));

      // Sort by AI score and return top recommendations
      return scoredExercises
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 3);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return exercises.slice(0, 3);
    }
  }

  // Enhanced training with history tracking
  async trainModel(exercise, userStats, sorenessLevel) {
    if (!this.isModelLoaded) {
      await this.initialize();
    }

    try {
      const features = this.prepareFeatures(exercise, userStats);
      const target = tf.tensor2d([[sorenessLevel / 5]]);

      // Train the model with the new data point
      const history = await this.model.fit(features, target, {
        epochs: 10,
        verbose: 0
      });

      // Store training history
      this.trainingHistory.push({
        timestamp: new Date().toISOString(),
        exercise: exercise.id,
        soreness: sorenessLevel,
        loss: history.history.loss[history.history.loss.length - 1]
      });

      // Keep only last 100 training records
      if (this.trainingHistory.length > 100) {
        this.trainingHistory = this.trainingHistory.slice(-100);
      }

      console.debug('Training completed:', {
        exercise: exercise.id,
        soreness: sorenessLevel,
        loss: history.history.loss[history.history.loss.length - 1]
      });

      // Save model after training
      await this.saveModel();
    } catch (error) {
      console.error('Error training model:', error);
    }
  }

  // Get model statistics
  getModelStats() {
    return {
      isLoaded: this.isModelLoaded,
      trainingHistory: this.trainingHistory,
      lastPredictions: this.lastPredictions,
      featureSize: this.featureSize
    };
  }

  // Reset model and training history
  async resetModel() {
    this.model = null;
    this.isModelLoaded = false;
    this.trainingHistory = [];
    this.lastPredictions = [];
    localStorage.removeItem('exerciseAI');
    await this.initialize();
  }

  // Save model to localStorage
  async saveModel() {
    if (!this.isModelLoaded) return;

    try {
      const modelJSON = await this.model.toJSON();
      localStorage.setItem('exerciseAI', JSON.stringify(modelJSON));
      console.log('Model saved successfully');
    } catch (error) {
      console.error('Error saving model:', error);
    }
  }

  // Load model from localStorage
  async loadModel() {
    try {
      const savedModel = localStorage.getItem('exerciseAI');
      if (savedModel) {
        const modelJSON = JSON.parse(savedModel);
        this.model = await tf.models.modelFromJSON(modelJSON);
        this.isModelLoaded = true;
        console.log('Model loaded successfully');
      }
    } catch (error) {
      console.error('Error loading model:', error);
      await this.initialize();
    }
  }
}

export const aiService = new AIRecommendationService(); 