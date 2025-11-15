# 📚 Algoritmo de Repetición Espaciada - Archivos Creados

## ✅ Archivos Generados

```
study-planner-api/src/logic/
├── 📄 spacedRepetition.js          ← Algoritmo principal (clase SpacedRepetitionEngine)
├── 🧪 test-spaced-repetition.js    ← Suite completa de 5 pruebas
├── ⚡ quick-example.js              ← Ejemplo rápido para probar
└── 📖 README.md                     ← Documentación completa
```

---

## 🚀 Cómo Usar

### 1️⃣ Ejecutar Ejemplo Rápido (Recomendado para empezar)

```bash
node study-planner-api/src/logic/quick-example.js
```

**Qué hace:**
- Crea 7 temas de ejemplo
- Muestra recomendaciones para hoy
- Simula estudiar un tema
- Guarda el progreso en `quick-example-state.json`

---

### 2️⃣ Ejecutar Suite de Pruebas Completa

```bash
node study-planner-api/src/logic/test-spaced-repetition.js
```

**Incluye:**
- ✅ Prueba 1: Inicialización básica
- ✅ Prueba 2: Actualización tras estudio
- ✅ Prueba 3: Simulación de múltiples sesiones
- ✅ Prueba 4: Persistencia (guardar/cargar)
- ✅ Prueba 5: Aleatoriedad controlada

---

### 3️⃣ Ejecutar Ejemplo Integrado

```bash
node study-planner-api/src/logic/spacedRepetition.js
```

**Qué hace:**
- Ejemplo completo con 10 temas
- Simula sesión de estudio con 3 temas
- Muestra todas las listas generadas

---

## 📊 Salida del Algoritmo

Al llamar `engine.generateRecommendations(5)` obtienes:

```javascript
{
  // PRINCIPAL: Temas para estudiar HOY (mezcla inteligente)
  sugeridosParaSesionActual: [
    {
      name: "AWS",
      lastReviewed: null,
      difficultyScore: 0.5,
      interval: 1,
      nextReviewDate: "2025-11-14T00:00:00.000Z",
      reviewCount: 0,
      createdAt: "2025-11-14T00:00:00.000Z",
      reason: "review-due" // review-due | high-difficulty | short-interval | random-variety
    },
    // ... más temas
  ],

  // Temas que deben repasarse HOY (determinista)
  temasParaHoy: [...],

  // Temas sugeridos para MAÑANA
  temasProximaSesion: [...],

  // Todos los temas ordenados por dificultad DESC
  temasMasDificiles: [...],

  // Todos los temas ordenados por dificultad ASC
  temasMenosDificiles: [...],

  // Estadísticas generales
  estadoActual: {
    totalTopics: 10,
    averageDifficulty: 0.52,
    topicsNeverReviewed: 7
  }
}
```

---

## 🎯 Uso Básico en Código

```javascript
import { SpacedRepetitionEngine, DIFFICULTY_LEVEL } from './spacedRepetition.js';

// 1. Crear instancia
const engine = new SpacedRepetitionEngine('./my-state.json');

// 2. Cargar temas
const temas = ["React", "Node.js", "PostgreSQL"];
engine.loadTopics(temas);

// 3. Cargar progreso anterior (opcional)
await engine.loadState();

// 4. Obtener recomendaciones
const { sugeridosParaSesionActual } = engine.generateRecommendations(3);

console.log('Temas para hoy:', sugeridosParaSesionActual.map(t => t.name));

// 5. Marcar como estudiado
engine.markAsStudied('React', DIFFICULTY_LEVEL.EASY);
engine.markAsStudied('Node.js', DIFFICULTY_LEVEL.HARD);

// 6. Guardar progreso
await engine.saveState();
```

---

## 🎚️ Niveles de Dificultad

```javascript
import { DIFFICULTY_LEVEL } from './spacedRepetition.js';

DIFFICULTY_LEVEL.EASY    // Tema fácil  → interval *= 2, difficulty -= 0.15
DIFFICULTY_LEVEL.NORMAL  // Moderado    → interval *= 1.3, difficulty *= 0.95
DIFFICULTY_LEVEL.HARD    // Difícil     → interval = 1, difficulty += 0.2
```

---

## 📁 Archivos de Estado Generados

Cuando ejecutas los ejemplos, se crean archivos JSON automáticamente:

- `quick-example-state.json` ← Del ejemplo rápido
- `example-state.json` ← Del ejemplo integrado
- `test-state-1.json` hasta `test-state-5.json` ← De las pruebas
- `test-persistence.json` ← De la prueba de persistencia

**Estructura de archivo:**
```json
{
  "topics": [
    [
      "React",
      {
        "name": "React",
        "lastReviewed": "2025-11-14T00:00:00.000Z",
        "difficultyScore": 0.35,
        "interval": 2,
        "nextReviewDate": "2025-11-16T00:00:00.000Z",
        "reviewCount": 1,
        "createdAt": "2025-11-14T00:00:00.000Z"
      }
    ]
  ],
  "lastUpdated": "2025-11-14T10:30:00.000Z"
}
```

---

## 🔧 Métodos Principales

### Clase: `SpacedRepetitionEngine`

| Método | Descripción |
|--------|-------------|
| `loadTopics(names[])` | Carga/inicializa temas desde un arreglo de nombres |
| `generateRecommendations(max)` | **PRINCIPAL**: Genera todas las listas |
| `markAsStudied(name, difficulty)` | Actualiza un tema tras estudiarlo |
| `saveState()` | Guarda estado en JSON |
| `loadState()` | Carga estado desde JSON |
| `getTemasParaHoy()` | Temas que deben repasarse hoy |
| `getTemasProximaSesion()` | Temas sugeridos para mañana |
| `getTemasMasDificiles()` | Ordenados por dificultad DESC |
| `getTemasMenosDificiles()` | Ordenados por dificultad ASC |
| `getSugeridosParaSesionActual(max)` | **ALGORITMO PRINCIPAL** |
| `getAverageDifficulty()` | Dificultad promedio |
| `getTopicsNeverReviewed()` | Temas sin repasar |
| `getAllTopicsState()` | Estado completo de todos los temas |

---

## 🧠 Lógica del Algoritmo Principal

### `sugeridosParaSesionActual` - Orden de Prioridad:

1. **MÁXIMA** → Temas con `nextReviewDate <= hoy`
2. **ALTA** → Temas difíciles (`score > 0.6`) con intervalos cortos
3. **MEDIA** → Temas con intervalos cortos (`< 5 días`)
4. **BAJA** → 1-2 temas aleatorios del top 30% más importante

### Restricciones:

- ❌ No incluye temas repasados hace menos de 1-2 días
- ✅ Siempre prioriza temas urgentes y difíciles
- 🎲 Aleatoriedad controlada para variedad

---

## ✅ Estado del Proyecto

- ✅ **Algoritmo completo y funcional**
- ✅ **5 pruebas automatizadas pasando**
- ✅ **3 ejemplos de uso incluidos**
- ✅ **Documentación completa**
- ✅ **Persistencia en JSON**
- ✅ **Sin dependencias externas**
- ✅ **Código comentado y legible**
- ✅ **Arquitectura POO extensible**

---

## 📖 Documentación Completa

Lee el archivo `README.md` en la misma carpeta para:
- Descripción detallada de la arquitectura
- Explicación del algoritmo SM-2
- Ejemplos de código completos
- Tabla de ajustes de dificultad e intervalos
- Roadmap de mejoras futuras

---

## 💡 Próximos Pasos

1. **Probar el algoritmo** → `node quick-example.js`
2. **Revisar la documentación** → Leer `README.md`
3. **Integrar con la API** → Crear endpoints REST
4. **Conectar con PostgreSQL** → Migrar de JSON a base de datos
5. **Integrar con frontend** → Usar en React

---

**Creado por**: Daniel P.  
**Fecha**: Noviembre 14, 2025  
**Ubicación**: `study-planner-api/src/logic/`
