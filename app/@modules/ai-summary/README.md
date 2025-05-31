# AI Summary Component

Este componente proporciona análisis de problemas mediante IA, generando soluciones detalladas con estimaciones de tiempo y costo.

## Uso

```tsx
import { AISummaryComponent } from "../@modules/ai-summary";

<AISummaryComponent
  issueId={issue.id}
  issueTitle={issue.title}
  issueDescription={issue.description}
  issueCategory={issue.category}
  issuePriority={issue.priority}
/>
```

## Props

- `issueId`: ID único del issue (number)
- `issueTitle`: Título del problema (string)
- `issueDescription`: Descripción detallada del problema (string)
- `issueCategory`: Categoría del problema (string, opcional)
- `issuePriority`: Prioridad del problema (string, opcional)

## Características

- **Llamada API Inteligente**: Envía datos del issue al endpoint `/api/summarize`
- **Loading State**: Muestra un skeleton loader durante la espera (400ms simulados)
- **Dropdown Expandible**: El summary se muestra como preview del dropdown
- **Análisis Detallado**: Incluye soluciones, estimaciones de tiempo y costo
- **Error Handling**: Manejo robusto de errores con feedback visual

## Respuesta del API

El componente espera una respuesta con esta estructura:

```typescript
interface AISummaryResponse {
  summary: string;
  solutions: SolutionItem[];
  totalEstimatedTime: string;
  totalEstimatedCost: string;
}

interface SolutionItem {
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  timeEstimate: string;
  costEstimate: string;
}
```

## Arquitectura

- **Separado y Reutilizable**: Componente independiente que se puede integrar en cualquier parte de la aplicación
- **Cumple Reglas del Workspace**: Ubicado en `@modules` ya que realiza llamadas API
- **Simulación de Delay**: 400ms de delay como se especifica en las reglas del workspace 