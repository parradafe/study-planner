# Algoritmo de Repetición Espaciada (Spaced Repetition)

## 📋 Descripción

Algoritmo de repetición espaciada inspirado en **Anki** y basado en el algoritmo **SM-2 (SuperMemo 2)**, adaptado para trabajar únicamente con nombres de temas (sin tarjetas de pregunta/respuesta).

## 🎯 Características Principales

- ✅ **Inicialización automática** de temas nuevos
- ✅ **5 listas diferentes** generadas dinámicamente
- ✅ **Algoritmo SM-2 simplificado** para ajustar intervalos
- ✅ **Aleatoriedad controlada** (top 30% de temas importantes)
- ✅ **Persistencia en JSON** sin dependencias externas
- ✅ **Arquitectura POO** clara y extensible

## 🏗️ Arquitectura

```
SpacedRepetitionEngine
├── Inicialización de temas
├── Generación de listas
│   ├── temasParaHoy
│   ├── temasProximaSesion
│   ├── temasMasDificiles
│   ├── temasMenosDificiles
│   └── sugeridosParaSesionActual (ALGORITMO PRINCIPAL)
├── Actualización tras estudio
│   ├── Ajuste de difficultyScore
│   ├── Ajuste de interval (SM-2)
│   └── Cálculo de nextReviewDate
└── Persistencia
    ├── saveState()
    └── loadState()
```

## 📊 Estado de cada Tema

Cada tema mantiene el siguiente estado interno:

```javascript
{
  name: "Nombre del tema",
  lastReviewed: null | "2025-11-14T00:00:00.000Z",
  difficultyScore: 0.5,  // 0 = fácil, 1 = muy difícil
  interval: 1,            // Días hasta próximo repaso
  nextReviewDate: "2025-11-14T00:00:00.000Z",
  reviewCount: 0,         // Número de repasos realizados
  createdAt: "2025-11-14T00:00:00.000Z"
}
```

## 🚀 Uso Básico

### 1. Importar y crear instancia

```javascript
import { SpacedRepetitionEngine, DIFFICULTY_LEVEL } from './spacedRepetition.js';

const engine = new SpacedRepetitionEngine('./state.json');
```

### 2. Cargar temas

```javascript
const temas = ["Redes", "Estructuras de datos", "AWS", "Microservicios"];
engine.loadTopics(temas);
```

### 3. Generar recomendaciones

```javascript
const recommendations = engine.generateRecommendations(5);

console.log(recommendations);
// {
//   sugeridosParaSesionActual: [...],
//   temasParaHoy: [...],
//   temasProximaSesion: [...],
//   temasMasDificiles: [...],
//   temasMenosDificiles: [...],
//   estadoActual: { ... }
// }
```

### 4. Marcar tema como estudiado

```javascript
// Opciones: DIFFICULTY_LEVEL.EASY, DIFFICULTY_LEVEL.NORMAL, DIFFICULTY_LEVEL.HARD
engine.markAsStudied('Redes', DIFFICULTY_LEVEL.EASY);
engine.markAsStudied('AWS', DIFFICULTY_LEVEL.HARD);
```

### 5. Guardar estado

```javascript
await engine.saveState();
```

### 6. Cargar estado (próxima sesión)

```javascript
await engine.loadState();
```

## 📝 Descripción de las Listas Generadas

### 1. `sugeridosParaSesionActual` ⭐ (ALGORITMO PRINCIPAL)

**Lista inteligente para la sesión actual**, mezcla:

- **Prioridad máxima**: Temas con `nextReviewDate <= hoy`
- **Prioridad alta**: Temas difíciles (`difficultyScore > 0.6`) con intervalos cortos
- **Prioridad media**: Temas con intervalos cortos (`< 5 días`)
- **Aleatoriedad controlada**: 1-2 temas del top 30% más importante

**Restricciones**:
- No incluye temas repasados hace menos de 1-2 días
- Máximo configurable (por defecto 5 temas)
- Cada tema incluye la razón de su inclusión: `review-due`, `high-difficulty`, `short-interval`, `random-variety`

### 2. `temasParaHoy`

Temas que **deben repasarse hoy** según su `nextReviewDate`.

- Ordenados por urgencia (más vencidos primero)
- No incluye aleatoriedad, es determinista

### 3. `temasProximaSesion`

Temas sugeridos para **mañana o la próxima sesión**.

Criterios:
- `nextReviewDate` entre 0 y 3 días
- Prioriza temas cercanos + difíciles + intervalos cortos
- Máximo 5 temas

### 4. `temasMasDificiles`

Todos los temas ordenados por `difficultyScore` de **mayor a menor**.

### 5. `temasMenosDificiles`

Todos los temas ordenados por `difficultyScore` de **menor a mayor**.

## ⚙️ Algoritmo SM-2 Simplificado

Cuando marcas un tema como estudiado, el algoritmo ajusta:

### Ajuste de `difficultyScore`:

| Dificultad | Cambio en `difficultyScore` |
|------------|----------------------------|
| EASY       | `-0.15` (mín. 0)           |
| NORMAL     | `* 0.95` (reducción leve)  |
| HARD       | `+0.2` (máx. 1)            |

### Ajuste de `interval`:

| Dificultad | Cambio en `interval` |
|------------|---------------------|
| EASY       | `* 2` (duplicar)    |
| NORMAL     | `* 1.3` (incremento moderado) |
| HARD       | `= 1` (reiniciar)   |

### Cálculo de `nextReviewDate`:

```javascript
nextReviewDate = hoy + interval (días)
```

## 🧪 Ejecutar Pruebas

```bash
cd study-planner-api
node src/logic/test-spaced-repetition.js
```

Las pruebas incluyen:
1. ✅ Inicialización y generación de listas básicas
2. ✅ Actualización tras sesión de estudio
3. ✅ Simulación de múltiples sesiones
4. ✅ Persistencia (guardar/cargar estado)
5. ✅ Aleatoriedad controlada

## 📁 Persistencia

El estado se guarda en formato JSON:

```json
{
  "topics": [
    [
      "Redes",
      {
        "name": "Redes",
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

## 🎲 Aleatoriedad Controlada

El algoritmo **NO es completamente determinista** en `sugeridosParaSesionActual`:

- Los temas urgentes y difíciles **siempre** se incluyen (determinista)
- Se agregan **1-2 temas aleatorios** del top 30% más importante
- Esto evita que el usuario siempre vea los mismos temas
- La variación está **controlada** para no sugerir temas irrelevantes

## 🔧 Métodos Auxiliares

```javascript
// Obtener dificultad promedio
engine.getAverageDifficulty(); // 0.45

// Temas nunca repasados
engine.getTopicsNeverReviewed(); // [...]

// Estado completo de todos los temas
engine.getAllTopicsState(); // [...]
```

## 📦 Sin Dependencias Externas

El algoritmo solo usa módulos nativos de Node.js:
- `fs/promises` para persistencia

## 🎓 Ejemplo Completo

```javascript
import { SpacedRepetitionEngine, DIFFICULTY_LEVEL } from './spacedRepetition.js';

async function main() {
  // 1. Crear motor
  const engine = new SpacedRepetitionEngine('./my-study-state.json');

  // 2. Cargar temas
  const temas = ["React", "Node.js", "PostgreSQL", "Docker"];
  engine.loadTopics(temas);

  // 3. Intentar cargar estado previo
  await engine.loadState();

  // 4. Obtener sugerencias
  const { sugeridosParaSesionActual } = engine.generateRecommendations(3);
  
  console.log('📚 Temas sugeridos para hoy:');
  sugeridosParaSesionActual.forEach(t => console.log(`  - ${t.name}`));

  // 5. Estudiar temas
  engine.markAsStudied('React', DIFFICULTY_LEVEL.EASY);
  engine.markAsStudied('Docker', DIFFICULTY_LEVEL.HARD);

  // 6. Guardar estado
  await engine.saveState();
  console.log('✅ Progreso guardado');
}

main();
```

## 📈 Roadmap / Mejoras Futuras

- [ ] Agregar pesos configurables para los criterios de prioridad
- [ ] Soporte para categorías/etiquetas de temas
- [ ] Estadísticas detalladas (tiempo total estudiado, racha, etc.)
- [ ] Exportar/importar estado desde diferentes formatos
- [ ] Integración con base de datos (PostgreSQL)

## 📄 Licencia

Este código es parte del proyecto Study Planner.

---

**Creado por**: Daniel P.  
**Fecha**: Noviembre 2025  
**Versión**: 1.0.0
