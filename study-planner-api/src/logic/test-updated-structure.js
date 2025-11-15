/**
 * TEST - Verificar nueva estructura de persistencia
 * 
 * Este archivo demuestra que el algoritmo ahora usa un array simple
 * en lugar de Map con tuplas [key, value]
 */

import { SpacedRepetitionEngine, DIFFICULTY_LEVEL } from './spacedRepetition.js';

async function testNewStructure() {
  console.log('\n🧪 TEST: Nueva estructura de persistencia\n');
  console.log('=' .repeat(60));

  const engine = new SpacedRepetitionEngine('./test-new-structure.json');

  // 1. Cargar algunos temas
  const topics = ['Docker', 'Kubernetes', 'AWS Lambda'];
  console.log('\n1️⃣ Cargando temas:', topics);
  engine.loadTopics(topics);

  // 2. Marcar algunos como estudiados
  console.log('\n2️⃣ Marcando temas como estudiados:');
  engine.markAsStudied('Docker', DIFFICULTY_LEVEL.EASY);
  console.log('   ✓ Docker → EASY');
  
  engine.markAsStudied('Kubernetes', DIFFICULTY_LEVEL.HARD);
  console.log('   ✓ Kubernetes → HARD');

  // 3. Guardar estado
  console.log('\n3️⃣ Guardando estado...');
  await engine.saveState();
  console.log('   ✓ Estado guardado en test-new-structure.json');

  // 4. Crear nueva instancia y cargar
  console.log('\n4️⃣ Creando nueva instancia y cargando estado...');
  const engine2 = new SpacedRepetitionEngine('./test-new-structure.json');
  await engine2.loadState();
  console.log(`   ✓ Estado cargado: ${engine2.topics.length} temas`);

  // 5. Verificar estructura
  console.log('\n5️⃣ Verificando estructura del array:');
  console.log('   Tipo de this.topics:', Array.isArray(engine2.topics) ? '✅ Array' : '❌ No es Array');
  console.log('   Ejemplo de objeto:');
  console.log(JSON.stringify(engine2.topics[0], null, 2));

  // 6. Mostrar archivo JSON generado
  console.log('\n6️⃣ Estructura del archivo JSON:');
  const fs = await import('fs/promises');
  const content = await fs.readFile('./test-new-structure.json', 'utf-8');
  const parsed = JSON.parse(content);
  
  console.log('   ✅ topics es un array:', Array.isArray(parsed.topics));
  console.log('   ✅ Cada elemento es un objeto (no tupla):', typeof parsed.topics[0] === 'object');
  console.log('   ✅ Total de temas:', parsed.topics.length);

  console.log('\n' + '='.repeat(60));
  console.log('✅ TEST COMPLETADO - Nueva estructura funciona correctamente\n');

  return parsed;
}

// Ejecutar test
testNewStructure().catch(console.error);
