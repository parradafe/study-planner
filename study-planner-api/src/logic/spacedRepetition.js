/**
 * SPACED REPETITION ALGORITHM - Inspired by Anki (SM-2)
 * 
 * ARCHITECTURE:
 * - Main class: SpacedRepetitionEngine
 * - Each topic has an internal state that evolves over time
 * - Uses object-oriented programming to maintain state and encapsulation
 * - No persistence responsibilities (pure logic only)
 * 
 * FLOW:
 * 1. Initialize new topics with default values
 * 2. Generate lists based on different criteria (difficulty, dates, randomness)
 * 3. Update state after completing a study session
 * 4. Return state via JSON objects
 */

/**
 * Difficulty level perceived by the user when studying a topic
 */
const DIFFICULTY_LEVEL = {
  EASY: 'easy',      // Easy topic to remember
  NORMAL: 'normal',  // Moderate difficulty
  HARD: 'hard'       // Difficult topic, requires more review
};

/**
 * Spaced repetition engine
 * Pure engine without persistence responsibilities
 */
class SpacedRepetitionEngine {
  constructor(initialTopics = []) {
    this.topics = Array.isArray(initialTopics) ? [...initialTopics] : [];
  }

  /**
   * Initialize the state of a new topic
   * @param {string} topicName - Topic name
   * @returns {Object} Initial topic state
   */
  initializeTopic(topicName) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    return {
      name: topicName,
      lastReviewed: null,
      difficultyScore: 0.5,  // Initial medium difficulty (0 = easy, 1 = very hard)
      interval: 1,            // Days until next review
      nextReviewDate: today.toISOString(),
      reviewCount: 0,         // Total number of reviews
      createdAt: today.toISOString()
    };
  }

  /**
   * Find a topic by name in the array
   * @param {string} topicName 
   * @returns {Object|undefined}
   */
  findTopicByName(topicName) {
    return this.topics.find(topic => topic.name === topicName);
  }

  /**
   * Load topics from an array of names
   * @param {string[]} topicNames - Array of topic names
   */
  loadTopics(topicNames) {
    topicNames.forEach(name => {
      if (!this.findTopicByName(name)) {
        this.topics.push(this.initializeTopic(name));
      }
    });
  }

  /**
   * Get current date normalized (without time)
   * @returns {Date}
   */
  getTodayNormalized() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Calculate days difference between two dates
   * @param {Date|string} date1 
   * @param {Date|string} date2 
   * @returns {number} Days difference
   */
  daysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  /**
   * LIST GENERATION
   */

  /**
   * Topics that should be reviewed today (nextReviewDate <= today)
   * @returns {Object[]}
   */
  getTopicsForToday() {
    const today = this.getTodayNormalized();
    const result = [];

    this.topics.forEach(topic => {
      const nextReview = new Date(topic.nextReviewDate);
      if (nextReview <= today) {
        result.push({ ...topic });
      }
    });

    // Sort by nextReviewDate (most urgent first)
    return result.sort((a, b) => 
      new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
    );
  }

  /**
   * Suggested topics for the next session (tomorrow or nearby)
   * Prioriza: proximidad a nextReviewDate, dificultad alta, intervalos cortos
   * @returns {Object[]}
   */
  getTopicsForNextSession() {
    const today = this.getTodayNormalized();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const candidates = [];

    this.topics.forEach(topic => {
      const nextReview = new Date(topic.nextReviewDate);
      const daysUntilReview = this.daysDifference(today, nextReview);

      // Include topics to be reviewed in the next 1-3 days
      if (daysUntilReview >= 0 && daysUntilReview <= 3) {
        // Calculate priority score
        const proximityScore = 3 - daysUntilReview; // Closer = higher score
        const difficultyWeight = topic.difficultyScore * 2;
        const intervalWeight = topic.interval < 7 ? 2 : 0; // Prioritize short intervals

        const priorityScore = proximityScore + difficultyWeight + intervalWeight;

        candidates.push({
          ...topic,
          priorityScore
        });
      }
    });

    // Sort by priority score
    return candidates
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5) // Maximum 5 topics for next session
      .map(({ priorityScore, ...topic }) => topic);
  }

  /**
   * Topics sorted by difficulty (highest to lowest)
   * @returns {Object[]}
   */
  getMostDifficultTopics() {
    return [...this.topics]
      .sort((a, b) => b.difficultyScore - a.difficultyScore);
  }

  /**
   * Topics sorted by difficulty (lowest to highest)
   * @returns {Object[]}
   */
  getLeastDifficultTopics() {
    return [...this.topics]
      .sort((a, b) => a.difficultyScore - b.difficultyScore);
  }

  /**
   * MAIN ALGORITHM: Suggested topics for current session
   * Intelligent mix of:
   * - Topics with nextReviewDate <= today
   * - Topics with higher difficulty
   * - Topics with short intervals
   * - Controlled randomness (1-2 topics from top 30%)
   * 
   * @param {number} maxTopics - Maximum number of topics to suggest
   * @returns {Object[]}
   */
  getSuggestedTopicsForCurrentSession(maxTopics = 5) {
    const today = this.getTodayNormalized();
    const allTopics = [...this.topics];
    
    // Set to avoid duplicates
    const selectedTopics = new Set();
    const result = [];

    // 1. MAXIMUM PRIORITY: Topics that should be reviewed today
    const todayTopics = this.getTopicsForToday();
    todayTopics.forEach(topic => {
      if (selectedTopics.size < maxTopics) {
        selectedTopics.add(topic.name);
        result.push({ ...topic, reason: 'review-due' });
      }
    });

    // 2. HIGH PRIORITY: Difficult topics with short intervals
    if (selectedTopics.size < maxTopics) {
      const difficultTopics = allTopics
        .filter(topic => {
          const nextReview = new Date(topic.nextReviewDate);
          const daysSinceReview = topic.lastReviewed 
            ? this.daysDifference(new Date(topic.lastReviewed), today)
            : 999;
          
          return !selectedTopics.has(topic.name) &&
                 daysSinceReview > 1 && // Don't review very recent topics
                 topic.difficultyScore > 0.6; // Only difficult topics
        })
        .sort((a, b) => {
          // Sort by: difficulty * short interval weight
          const scoreA = a.difficultyScore * (a.interval < 7 ? 2 : 1);
          const scoreB = b.difficultyScore * (b.interval < 7 ? 2 : 1);
          return scoreB - scoreA;
        })
        .slice(0, maxTopics - selectedTopics.size);

      difficultTopics.forEach(topic => {
        selectedTopics.add(topic.name);
        result.push({ ...topic, reason: 'high-difficulty' });
      });
    }

    // 3. MEDIUM PRIORITY: Topics with short intervals
    if (selectedTopics.size < maxTopics) {
      const shortIntervalTopics = allTopics
        .filter(topic => {
          const daysSinceReview = topic.lastReviewed 
            ? this.daysDifference(new Date(topic.lastReviewed), today)
            : 999;
          
          return !selectedTopics.has(topic.name) &&
                 daysSinceReview > 1 &&
                 topic.interval < 5;
        })
        .sort((a, b) => a.interval - b.interval)
        .slice(0, maxTopics - selectedTopics.size);

      shortIntervalTopics.forEach(topic => {
        selectedTopics.add(topic.name);
        result.push({ ...topic, reason: 'short-interval' });
      });
    }

    // 4. CONTROLLED RANDOMNESS: 1-2 topics from top 30%
    if (selectedTopics.size < maxTopics) {
      const eligibleForRandom = allTopics
        .filter(topic => {
          const daysSinceReview = topic.lastReviewed 
            ? this.daysDifference(new Date(topic.lastReviewed), today)
            : 999;
          
          return !selectedTopics.has(topic.name) && daysSinceReview > 2;
        })
        .sort((a, b) => {
          // Combined score: difficulty + proximity to nextReviewDate
          const daysUntilReviewA = this.daysDifference(today, new Date(a.nextReviewDate));
          const daysUntilReviewB = this.daysDifference(today, new Date(b.nextReviewDate));
          
          const scoreA = a.difficultyScore * 10 - daysUntilReviewA;
          const scoreB = b.difficultyScore * 10 - daysUntilReviewB;
          
          return scoreB - scoreA;
        });

      // Top 30% of eligible topics
      const top30PercentCount = Math.ceil(eligibleForRandom.length * 0.3);
      const top30Percent = eligibleForRandom.slice(0, top30PercentCount);

      // Select 1-2 random topics from top 30%
      const randomCount = Math.min(2, maxTopics - selectedTopics.size, top30Percent.length);
      
      for (let i = 0; i < randomCount; i++) {
        const randomIndex = Math.floor(Math.random() * top30Percent.length);
        const randomTopic = top30Percent.splice(randomIndex, 1)[0];
        
        if (randomTopic && !selectedTopics.has(randomTopic.name)) {
          selectedTopics.add(randomTopic.name);
          result.push({ ...randomTopic, reason: 'random-variety' });
        }
      }
    }

    return result.slice(0, maxTopics);
  }

  /**
   * UPDATE AFTER STUDY SESSION
   * Updates topic state based on perceived difficulty (simplified SM-2)
   * 
   * @param {string} topicName - Name of the studied topic
   * @param {string} difficulty - 'easy', 'normal', or 'hard'
   */
  markAsStudied(topicName, difficulty = DIFFICULTY_LEVEL.NORMAL) {
    const topic = this.findTopicByName(topicName);
    
    if (!topic) {
      throw new Error(`Topic "${topicName}" not found`);
    }

    const today = this.getTodayNormalized();

    // Update lastReviewed
    topic.lastReviewed = today.toISOString();
    topic.reviewCount += 1;

    // Adjust difficultyScore based on user perception
    switch (difficulty) {
      case DIFFICULTY_LEVEL.EASY:
        // Decrease difficulty (minimum 0)
        topic.difficultyScore = Math.max(0, topic.difficultyScore - 0.15);
        break;
      
      case DIFFICULTY_LEVEL.NORMAL:
        // Maintain or adjust slightly toward the mean
        topic.difficultyScore = topic.difficultyScore * 0.95;
        break;
      
      case DIFFICULTY_LEVEL.HARD:
        // Increase difficulty (maximum 1)
        topic.difficultyScore = Math.min(1, topic.difficultyScore + 0.2);
        break;
    }

    // Adjust interval using simplified SM-2
    switch (difficulty) {
      case DIFFICULTY_LEVEL.EASY:
        // Double interval if it was easy
        topic.interval = Math.round(topic.interval * 2);
        break;
      
      case DIFFICULTY_LEVEL.NORMAL:
        // Moderate increase
        topic.interval = Math.round(topic.interval * 1.3);
        break;
      
      case DIFFICULTY_LEVEL.HARD:
        // Reset interval if it was hard
        topic.interval = 1;
        break;
    }

    // Ensure minimum interval of 1 day
    topic.interval = Math.max(1, topic.interval);

    // Calculate nextReviewDate
    const nextReview = new Date(today);
    nextReview.setDate(nextReview.getDate() + topic.interval);
    topic.nextReviewDate = nextReview.toISOString();
  }

  /**
   * STATE EXPORT/IMPORT
   */

  /**
   * Export current state as JSON object
   * @returns {Object} Complete state with metadata
   */
  exportState() {
    return {
      topics: this.topics.map(topic => ({ ...topic })),
      lastUpdated: new Date().toISOString(),
      totalTopics: this.topics.length
    };
  }

  /**
   * Import state from JSON object
   * @param {Object} state - State to import
   * @returns {boolean} Operation success
   */
  importState(state) {
    try {
      if (!state || !Array.isArray(state.topics)) {
        throw new Error('Invalid state format');
      }
      
      this.topics = state.topics.map(topic => ({ ...topic }));
      return true;
    } catch (error) {
      console.error('Error importing state:', error);
      return false;
    }
  }

  /**
   * MAIN METHOD
   * Generate all lists and return object with expected structure
   * 
   * @param {number} maxSuggestions - Maximum number of suggestions for current session
   * @returns {Object}
   */
  generateRecommendations(maxSuggestions = 5) {
    return {
      suggestedForCurrentSession: this.getSuggestedTopicsForCurrentSession(maxSuggestions),
      topicsForToday: this.getTopicsForToday(),
      topicsForNextSession: this.getTopicsForNextSession(),
      mostDifficultTopics: this.getMostDifficultTopics(),
      leastDifficultTopics: this.getLeastDifficultTopics(),
      currentState: {
        totalTopics: this.topics.length,
        averageDifficulty: this.getAverageDifficulty(),
        topicsNeverReviewed: this.getTopicsNeverReviewed().length
      }
    };
  }

  /**
   * AUXILIARY METHODS
   */

  /**
   * Calculate average difficulty of all topics
   * @returns {number}
   */
  getAverageDifficulty() {
    if (this.topics.length === 0) return 0;
    
    const total = this.topics
      .reduce((sum, topic) => sum + topic.difficultyScore, 0);
    
    return parseFloat((total / this.topics.length).toFixed(2));
  }

  /**
   * Get topics that have never been reviewed
   * @returns {Object[]}
   */
  getTopicsNeverReviewed() {
    return this.topics
      .filter(topic => topic.lastReviewed === null);
  }

  /**
   * Get complete state of all topics
   * @returns {Object[]}
   */
  getAllTopicsState() {
    return [...this.topics];
  }
}

// Exportar clase y constantes
export { SpacedRepetitionEngine, DIFFICULTY_LEVEL };

/**
 * EJEMPLO DE USO
 */
export function exampleUsage() {
  console.log('\n=== EJEMPLO DE USO DEL ALGORITMO DE REPETICIÓN ESPACIADA ===\n');

  // 1. Crear instancia del motor (sin persistencia)
  const engine = new SpacedRepetitionEngine();

  // 2. Cargar temas de estudio
  const temas = [
    "Redes",
    "Estructuras de datos",
    "AWS",
    "Microservicios",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "React",
    "Node.js",
    "Algoritmos"
  ];

  console.log('📚 Cargando temas:', temas);
  engine.loadTopics(temas);

  // 3. Generar recomendaciones iniciales
  console.log('\n🎯 RECOMENDACIONES INICIALES:\n');
  let recommendations = engine.generateRecommendations(5);
  
  console.log('Suggested for current session:', 
    recommendations.suggestedForCurrentSession.map(t => `${t.name} (${t.reason})`));
  console.log('\nTopics for today:', 
    recommendations.topicsForToday.map(t => t.name));
  console.log('\nCurrent state:', recommendations.currentState);

  // 4. Simulate studying some topics
  console.log('\n\n📖 SIMULATING STUDY SESSION...\n');
  
  engine.markAsStudied('Networks', DIFFICULTY_LEVEL.EASY);
  console.log('✓ Networks - Marked as EASY');
  
  engine.markAsStudied('AWS', DIFFICULTY_LEVEL.HARD);
  console.log('✓ AWS - Marked as HARD');
  
  engine.markAsStudied('Docker', DIFFICULTY_LEVEL.NORMAL);
  console.log('✓ Docker - Marked as NORMAL');

  // 5. Generate new recommendations after study
  console.log('\n\n🎯 UPDATED RECOMMENDATIONS:\n');
  recommendations = engine.generateRecommendations(5);
  
  console.log('Suggested for current session:', 
    recommendations.suggestedForCurrentSession.map(t => `${t.name} (${t.reason})`));
  console.log('\nTopics for next session:', 
    recommendations.topicsForNextSession.map(t => t.name));
  console.log('\nMost difficult topics:', 
    recommendations.mostDifficultTopics.slice(0, 3).map(t => 
      `${t.name} (score: ${t.difficultyScore.toFixed(2)})`));

  // 6. Show detailed state of some topics
  console.log('\n\n📊 DETAILED STATE OF STUDIED TOPICS:\n');
  ['Networks', 'AWS', 'Docker'].forEach(name => {
    const topic = engine.findTopicByName(name);
    if (topic) {
      console.log(`\n${name}:`);
      console.log(`  - Difficulty: ${topic.difficultyScore.toFixed(2)}`);
      console.log(`  - Interval: ${topic.interval} days`);
      console.log(`  - Next review: ${new Date(topic.nextReviewDate).toLocaleDateString()}`);
      console.log(`  - Total reviews: ${topic.reviewCount}`);
    }
  });

  // 7. Exportar estado como JSON (sin persistencia en archivo)
  console.log('\n\n� Exportando estado como JSON...');
  const exportedState = engine.exportState();
  console.log('✓ Estado exportado:', {
    totalTopics: exportedState.totalTopics,
    lastUpdated: exportedState.lastUpdated
  });

  console.log('\n=== FIN DEL EJEMPLO ===\n');

  return {
    recommendations,
    exportedState
  };
}

// Ejecutar ejemplo si se corre el archivo directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleUsage();
}
