/**
 * EJEMPLO SIMPLE Y RÁPIDO
 * 
 * Este archivo muestra un uso básico del algoritmo
 * para que puedas probarlo rápidamente.
 * 
 * EJECUTAR:
 * node study-planner-api/src/logic/quick-example.js
 */

import { SpacedRepetitionEngine, DIFFICULTY_LEVEL } from './spacedRepetition.js';

async function quickExample() {
  console.log('\n🎓 EJEMPLO RÁPIDO - Algoritmo de Repetición Espaciada\n');
  console.log('─'.repeat(60));

  // 1. Crear motor
  const engine = new SpacedRepetitionEngine('./quick-example-state.json');

  // 2. Definir tus temas de estudio
  const misTemas = [
    "JavaScript Avanzado",
    "React Hooks",
    "Node.js APIs",
    "PostgreSQL",
    "Docker Compose",
    "AWS Lambda",
    "TypeScript Genéricos"
  ];

  console.log('\n📚 Tus temas de estudio:');
  misTemas.forEach((tema, i) => console.log(`   ${i + 1}. ${tema}`));

  // 3. Cargar temas en el motor
  engine.loadTopics(misTemas);

  // 4. Intentar cargar progreso anterior (si existe)
  const loaded = await engine.loadState();
  if (loaded) {
    console.log('\n✅ Progreso anterior cargado');
  } else {
    console.log('\n🆕 Primera vez - Estado inicializado');
  }

  // 5. Obtener recomendaciones para hoy
  const { sugeridosParaSesionActual, estadoActual } = engine.generateRecommendations(5);

  console.log('\n🎯 TEMAS SUGERIDOS PARA HOY:');
  console.log('─'.repeat(60));
  
  if (sugeridosParaSesionActual.length === 0) {
    console.log('   ✨ ¡Felicitaciones! No hay temas pendientes por hoy.');
  } else {
    sugeridosParaSesionActual.forEach((topic, i) => {
      console.log(`\n   ${i + 1}. ${topic.name}`);
      console.log(`      📊 Dificultad: ${(topic.difficultyScore * 100).toFixed(0)}%`);
      console.log(`      🔄 Intervalo: ${topic.interval} día(s)`);
      console.log(`      📅 Próximo repaso: ${new Date(topic.nextReviewDate).toLocaleDateString()}`);
      console.log(`      💡 Razón: ${getReason(topic.reason)}`);
    });
  }

  // 6. Estadísticas generales
  console.log('\n\n📊 ESTADÍSTICAS:');
  console.log('─'.repeat(60));
  console.log(`   Total de temas: ${estadoActual.totalTopics}`);
  console.log(`   Dificultad promedio: ${(estadoActual.averageDifficulty * 100).toFixed(0)}%`);
  console.log(`   Temas sin repasar: ${estadoActual.topicsNeverReviewed}`);

  // 7. Simular estudio de un tema (descomenta para probar)
  console.log('\n\n💡 SIMULACIÓN: Estudiando un tema...');
  
  if (sugeridosParaSesionActual.length > 0) {
    const temaEstudiado = sugeridosParaSesionActual[0].name;
    
    // Marca como estudiado con dificultad NORMAL
    // Cambia a DIFFICULTY_LEVEL.EASY o DIFFICULTY_LEVEL.HARD según lo fácil/difícil que fue
    engine.markAsStudied(temaEstudiado, DIFFICULTY_LEVEL.NORMAL);
    
    console.log(`   ✅ Tema estudiado: "${temaEstudiado}"`);
    console.log(`   📝 Dificultad reportada: NORMAL`);
    
    // Ver nuevo estado del tema
    const topicState = engine.topics.get(temaEstudiado);
    console.log(`\n   Nuevo estado:`);
    console.log(`      📊 Dificultad: ${(topicState.difficultyScore * 100).toFixed(0)}%`);
    console.log(`      🔄 Intervalo: ${topicState.interval} día(s)`);
    console.log(`      📅 Próximo repaso: ${new Date(topicState.nextReviewDate).toLocaleDateString()}`);
    console.log(`      #️⃣  Repasos totales: ${topicState.reviewCount}`);
  }

  // 8. Guardar progreso
  await engine.saveState();
  console.log('\n💾 Progreso guardado exitosamente');

  console.log('\n─'.repeat(60));
  console.log('✨ Ejemplo completado\n');
  
  console.log('💡 PRÓXIMOS PASOS:');
  console.log('   1. Ejecuta este archivo de nuevo para ver tus recomendaciones actualizadas');
  console.log('   2. Modifica DIFFICULTY_LEVEL según cómo te fue con cada tema');
  console.log('   3. El algoritmo ajustará automáticamente los intervalos y dificultad\n');
}

// Función auxiliar para traducir razones
function getReason(reason) {
  const reasons = {
    'review-due': 'Repaso pendiente',
    'high-difficulty': 'Alta dificultad',
    'short-interval': 'Intervalo corto',
    'random-variety': 'Variedad aleatoria'
  };
  return reasons[reason] || reason;
}

// Ejecutar ejemplo
quickExample().catch(console.error);
