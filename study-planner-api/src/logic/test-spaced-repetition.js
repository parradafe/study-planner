/**
 * ARCHIVO DE PRUEBA PARA EL ALGORITMO DE REPETICIÓN ESPACIADA
 * 
 * Este archivo te permite probar todas las funcionalidades del algoritmo
 * sin integrarlo aún al resto de la aplicación.
 * 
 * CÓMO EJECUTAR:
 * node study-planner-api/src/logic/test-spaced-repetition.js
 */

import { SpacedRepetitionEngine, DIFFICULTY_LEVEL } from './spacedRepetition.js';

/**
 * PRUEBA 1: Inicialización y generación de listas básicas
 */
async function test1_BasicInitialization() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PRUEBA 1: Inicialización y Generación de Listas');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const engine = new SpacedRepetitionEngine('./test-state-1.json');

  const temas = ["Redes", "Estructuras de datos", "AWS", "Microservicios"];
  
  console.log('📚 Temas cargados:', temas);
  engine.loadTopics(temas);

  const recommendations = engine.generateRecommendations(5);

  console.log('\n✅ RESULTADOS:');
  console.log('\n1. Sugeridos para sesión actual:');
  recommendations.sugeridosParaSesionActual.forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name} - Razón: ${topic.reason}`);
  });

  console.log('\n2. Temas para hoy:');
  recommendations.temasParaHoy.forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name}`);
  });

  console.log('\n3. Temas más difíciles:');
  recommendations.temasMasDificiles.forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name} - Score: ${topic.difficultyScore.toFixed(2)}`);
  });

  console.log('\n4. Estado actual:');
  console.log('   Total de temas:', recommendations.estadoActual.totalTopics);
  console.log('   Dificultad promedio:', recommendations.estadoActual.averageDifficulty);
  console.log('   Temas sin repasar:', recommendations.estadoActual.topicsNeverReviewed);

  await engine.saveState();
  console.log('\n💾 Estado guardado en test-state-1.json');
}

/**
 * PRUEBA 2: Actualización de temas tras estudio
 */
async function test2_StudyAndUpdate() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PRUEBA 2: Actualización Tras Sesión de Estudio');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const engine = new SpacedRepetitionEngine('./test-state-2.json');

  const temas = ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL"];
  engine.loadTopics(temas);

  console.log('📚 Temas inicializados:', temas);
  console.log('\n📖 Simulando sesión de estudio...\n');

  // Estudiar con diferentes dificultades
  const studySession = [
    { topic: 'JavaScript', difficulty: DIFFICULTY_LEVEL.EASY },
    { topic: 'TypeScript', difficulty: DIFFICULTY_LEVEL.HARD },
    { topic: 'React', difficulty: DIFFICULTY_LEVEL.NORMAL },
  ];

  studySession.forEach(({ topic, difficulty }) => {
    const beforeState = { ...engine.topics.get(topic) };
    engine.markAsStudied(topic, difficulty);
    const afterState = engine.topics.get(topic);

    console.log(`\n✓ ${topic} - Dificultad percibida: ${difficulty.toUpperCase()}`);
    console.log(`  Antes:  difficultyScore=${beforeState.difficultyScore.toFixed(2)}, interval=${beforeState.interval} días`);
    console.log(`  Después: difficultyScore=${afterState.difficultyScore.toFixed(2)}, interval=${afterState.interval} días`);
    console.log(`  Próximo repaso: ${new Date(afterState.nextReviewDate).toLocaleDateString()}`);
  });

  console.log('\n\n🎯 Nuevas recomendaciones:');
  const recommendations = engine.generateRecommendations(5);
  
  console.log('\nSugeridos para sesión actual:');
  recommendations.sugeridosParaSesionActual.forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name} (${topic.reason})`);
  });

  await engine.saveState();
  console.log('\n💾 Estado guardado en test-state-2.json');
}

/**
 * PRUEBA 3: Simulación de múltiples sesiones
 */
async function test3_MultipleSessionsSimulation() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PRUEBA 3: Simulación de Múltiples Sesiones');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const engine = new SpacedRepetitionEngine('./test-state-3.json');

  const temas = [
    "Algoritmos de ordenamiento",
    "Árboles binarios",
    "Grafos",
    "Programación dinámica",
    "Backtracking"
  ];

  engine.loadTopics(temas);
  console.log('📚 Temas cargados:', temas);

  // Simular 3 sesiones de estudio
  const sessions = [
    {
      day: 'Día 1',
      studies: [
        { topic: 'Algoritmos de ordenamiento', difficulty: DIFFICULTY_LEVEL.EASY },
        { topic: 'Árboles binarios', difficulty: DIFFICULTY_LEVEL.HARD },
      ]
    },
    {
      day: 'Día 2',
      studies: [
        { topic: 'Grafos', difficulty: DIFFICULTY_LEVEL.NORMAL },
        { topic: 'Árboles binarios', difficulty: DIFFICULTY_LEVEL.HARD }, // Segundo intento
      ]
    },
    {
      day: 'Día 3',
      studies: [
        { topic: 'Programación dinámica', difficulty: DIFFICULTY_LEVEL.HARD },
        { topic: 'Algoritmos de ordenamiento', difficulty: DIFFICULTY_LEVEL.EASY }, // Repaso
      ]
    }
  ];

  sessions.forEach(({ day, studies }) => {
    console.log(`\n📅 ${day}:`);
    studies.forEach(({ topic, difficulty }) => {
      engine.markAsStudied(topic, difficulty);
      console.log(`   ✓ ${topic} - ${difficulty}`);
    });
  });

  console.log('\n\n📊 ANÁLISIS FINAL:');
  
  const recommendations = engine.generateRecommendations(5);
  
  console.log('\n1. Temas más difíciles (top 3):');
  recommendations.temasMasDificiles.slice(0, 3).forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name}`);
    console.log(`      - Score de dificultad: ${topic.difficultyScore.toFixed(2)}`);
    console.log(`      - Repasos realizados: ${topic.reviewCount}`);
    console.log(`      - Intervalo actual: ${topic.interval} días`);
  });

  console.log('\n2. Temas menos difíciles (top 3):');
  recommendations.temasMenosDificiles.slice(0, 3).forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name}`);
    console.log(`      - Score de dificultad: ${topic.difficultyScore.toFixed(2)}`);
    console.log(`      - Intervalo actual: ${topic.interval} días`);
  });

  console.log('\n3. Sugeridos para próxima sesión:');
  recommendations.temasProximaSesion.forEach((topic, i) => {
    console.log(`   ${i + 1}. ${topic.name} (intervalo: ${topic.interval} días)`);
  });

  await engine.saveState();
  console.log('\n💾 Estado guardado en test-state-3.json');
}

/**
 * PRUEBA 4: Persistencia - Guardar y Cargar
 */
async function test4_Persistence() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PRUEBA 4: Persistencia (Guardar y Cargar Estado)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Crear y guardar estado
  const engine1 = new SpacedRepetitionEngine('./test-persistence.json');
  const temas = ["Docker", "Kubernetes", "AWS Lambda"];
  
  engine1.loadTopics(temas);
  engine1.markAsStudied('Docker', DIFFICULTY_LEVEL.EASY);
  engine1.markAsStudied('Kubernetes', DIFFICULTY_LEVEL.HARD);
  
  console.log('💾 Guardando estado inicial...');
  await engine1.saveState();
  
  const state1 = engine1.getAllTopicsState();
  console.log('\nEstado guardado:');
  state1.forEach(topic => {
    console.log(`   - ${topic.name}: difficulty=${topic.difficultyScore.toFixed(2)}, interval=${topic.interval}`);
  });

  // Cargar estado en una nueva instancia
  console.log('\n\n📂 Cargando estado en nueva instancia...');
  const engine2 = new SpacedRepetitionEngine('./test-persistence.json');
  await engine2.loadState();
  
  const state2 = engine2.getAllTopicsState();
  console.log('\nEstado cargado:');
  state2.forEach(topic => {
    console.log(`   - ${topic.name}: difficulty=${topic.difficultyScore.toFixed(2)}, interval=${topic.interval}`);
  });

  console.log('\n✅ Verificación: Los estados coinciden:', 
    JSON.stringify(state1) === JSON.stringify(state2) ? 'SÍ' : 'NO');
}

/**
 * PRUEBA 5: Aleatoriedad Controlada
 */
async function test5_ControlledRandomness() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PRUEBA 5: Aleatoriedad Controlada en Sugerencias');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const engine = new SpacedRepetitionEngine('./test-state-5.json');

  const temas = [
    "HTML", "CSS", "JavaScript", "TypeScript", "React", 
    "Vue", "Angular", "Svelte", "Next.js", "Nuxt.js"
  ];

  engine.loadTopics(temas);

  // Estudiar algunos temas hace varios días (simulación)
  engine.markAsStudied('HTML', DIFFICULTY_LEVEL.EASY);
  engine.markAsStudied('CSS', DIFFICULTY_LEVEL.EASY);
  engine.markAsStudied('JavaScript', DIFFICULTY_LEVEL.NORMAL);

  console.log('📚 Temas cargados:', temas.length);
  console.log('📖 Algunos temas ya estudiados: HTML, CSS, JavaScript');
  
  console.log('\n🎲 Generando sugerencias 3 veces (observar variación):\n');

  for (let i = 1; i <= 3; i++) {
    const recommendations = engine.generateRecommendations(5);
    console.log(`Intento ${i}:`);
    recommendations.sugeridosParaSesionActual.forEach((topic, j) => {
      console.log(`   ${j + 1}. ${topic.name} (${topic.reason})`);
    });
    console.log('');
  }

  console.log('💡 Nota: Los temas con "random-variety" pueden variar entre ejecuciones,');
  console.log('   pero siempre se seleccionan del top 30% más importante.\n');
}

/**
 * EJECUTAR TODAS LAS PRUEBAS
 */
async function runAllTests() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  SUITE DE PRUEBAS - ALGORITMO DE REPETICIÓN ESPACIADA       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  try {
    await test1_BasicInitialization();
    await test2_StudyAndUpdate();
    await test3_MultipleSessionsSimulation();
    await test4_Persistence();
    await test5_ControlledRandomness();

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ ERROR EN LAS PRUEBAS:', error);
    console.error(error.stack);
  }
}

// Ejecutar todas las pruebas
runAllTests();
