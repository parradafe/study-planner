# Cambios en SpacedRepetitionEngine

## Resumen de cambios realizados

Se ha actualizado el algoritmo de repetición espaciada para usar una estructura de datos más simple y compatible con JSON.

## ✅ Cambios implementados

### 1. **Estructura de datos interna**
- **ANTES**: Usaba `Map<string, Object>` para almacenar temas
- **AHORA**: Usa `Array<Object>` simple

```javascript
// ANTES
this.topics = new Map();
this.topics.set('Docker', { name: 'Docker', ... });

// AHORA
this.topics = [];
this.topics.push({ name: 'Docker', ... });
```

### 2. **Formato de persistencia JSON**

#### ANTES (tuplas en array):
```json
{
  "topics": [
    [
      "Docker",
      {
        "name": "Docker",
        "lastReviewed": "2025-11-14T05:00:00.000Z",
        "difficultyScore": 0.35,
        ...
      }
    ]
  ],
  "lastUpdated": "..."
}
```

#### AHORA (array simple de objetos):
```json
{
  "topics": [
    {
      "name": "Docker",
      "lastReviewed": "2025-11-14T05:00:00.000Z",
      "difficultyScore": 0.35,
      "interval": 2,
      "nextReviewDate": "2025-11-16T05:00:00.000Z",
      "reviewCount": 1,
      "createdAt": "2025-11-14T05:00:00.000Z"
    },
    {
      "name": "Kubernetes",
      ...
    }
  ],
  "lastUpdated": "2025-11-15T20:55:06.543Z"
}
```

### 3. **Métodos actualizados**

#### Nuevos métodos auxiliares:
- `findTopicByName(topicName)`: Busca un tema por nombre en el array

#### Métodos modificados:
- `loadTopics()`: Ahora busca duplicados con `findTopicByName()`
- `markAsStudied()`: Actualiza directamente el objeto (no usa `.set()`)
- `saveState()`: Guarda `this.topics` directamente (no convierte desde Map)
- `loadState()`: Carga array directamente en `this.topics`
- `getTemasMasDificiles()`: Usa `[...this.topics]` en lugar de `Array.from()`
- `getTemasMenosDificiles()`: Usa `[...this.topics]` en lugar de `Array.from()`
- `getSugeridosParaSesionActual()`: Usa `[...this.topics]` en lugar de `Array.from()`
- `getAverageDifficulty()`: Usa `this.topics.length` en lugar de `this.topics.size`
- `getTopicsNeverReviewed()`: Opera sobre array directamente
- `getAllTopicsState()`: Retorna `[...this.topics]`
- `generateRecommendations()`: Usa `this.topics.length` para `totalTopics`

### 4. **Compatibilidad**

✅ Todos los métodos públicos mantienen la misma firma
✅ El formato de retorno es idéntico
✅ Los endpoints de la API siguen funcionando sin cambios
✅ La persistencia es más simple y legible

## 📊 Ventajas del cambio

1. **JSON más limpio**: Array simple de objetos, fácil de leer y manipular
2. **Compatibilidad**: Mejor integración con bases de datos NoSQL
3. **Simplicidad**: Menos conversiones entre Map y Array
4. **Debugging**: Más fácil inspeccionar en consola y herramientas
5. **Performance**: Ligeramente más eficiente para colecciones pequeñas

## 🧪 Testing

Se ha creado un archivo de prueba: `src/logic/test-updated-structure.js`

Para ejecutar:
```bash
cd study-planner-api
node src/logic/test-updated-structure.js
```

## 🔄 Migración de archivos existentes

Si tienes archivos JSON con la estructura antigua, necesitas migrarlos:

```javascript
// Ejemplo de script de migración
import fs from 'fs/promises';

async function migrate(oldFile, newFile) {
  const data = JSON.parse(await fs.readFile(oldFile, 'utf-8'));
  
  // Convertir de Map entries a array simple
  const newTopics = data.topics.map(([name, topic]) => topic);
  
  await fs.writeFile(newFile, JSON.stringify({
    topics: newTopics,
    lastUpdated: new Date().toISOString()
  }, null, 2));
}
```

## ✨ No requiere cambios en:

- Endpoints de la API (`/api/spaced-repetition/*`)
- Service layer (`spacedRepetitionService.js`)
- Repository layer (ya estaba vacío)
- Código cliente que consume la API

Todo sigue funcionando igual desde el punto de vista externo.
