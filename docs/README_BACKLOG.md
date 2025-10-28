# Guía de Estimaciones, Tamaños y Riesgos – Frontend

> Esta guía define los criterios para establecer **tamaño**, **estimación horaria** y **nivel de riesgo** en las issues del repositorio `pulga-shop-frontend`.  
> Permite mantener consistencia entre las tareas de UI, lógica de estado y comunicación con la API.

---

##  1️⃣ Tamaños relativos (S / M / L)

El **tamaño** se asigna según la complejidad visual, lógica de estado y grado de integración con el backend o la API.

| Tamaño | Criterios técnicos | Ejemplo de issue |
|:--------|:------------------|:-----------------|
| **S (Small)** | Cambios menores en la interfaz o lógica local. Un solo componente o ajuste visual. Sin conexión a API. | Mostrar botón eliminar, ajuste CSS, label dinámico |
| **M (Medium)** | Interacción de usuario + actualización de estado global o llamada a API. Implica componentes reutilizables o validaciones simples. | Input numérico con botones +/–, actualizar cantidad en carrito |
| **L (Large)** | Flujos complejos con múltiples componentes, manejo de errores, feedback visual, y conexión a varias APIs. | Checkout visual, resumen dinámico del carrito, validación completa de formulario |

*El tamaño se mide por la cantidad de componentes, lógica y dependencias de datos.*

---

## 2️⃣ Estimación de horas

La **estimación** refleja el tiempo total necesario para desarrollar, probar y revisar visual y funcionalmente la UI.

Incluye:
- Implementación del componente (JSX + CSS + lógica).  
- Manejo de estado (React hooks, context o redux).  
- Integración con API o mock.  
- Pruebas visuales/manuales y validación funcional.  

| Tamaño | Rango estimado | Ejemplo |
|:--------|:----------------|:--------|
| **S** | 1–3 horas | Botón eliminar visual + acción local |
| **M** | 3–5 horas | Input numérico con llamada a API y feedback |
| **L** | 6–8 horas | Pantalla de checkout completa con totales dinámicos y validaciones |

💡 *Se recomienda revisar estas estimaciones al crear un nuevo sprint, ya que dependen del nivel de reutilización de componentes.*

---

## 3️⃣ Evaluación de riesgos

El **riesgo** se determina según la probabilidad de errores visuales o lógicos y el impacto sobre la experiencia del usuario.

| Nivel | Criterios | Ejemplo |
|:-------|:-----------|:---------|
| **Bajo** | Cambios visuales simples o componentes estáticos. Sin conexión a backend. | Botón eliminar, ícono, mensaje estático |
| **Medio** | Interacciones con estado o API, posibles errores de sincronización. | Input cantidad con PUT /carrito/{id} |
| **Alto** | Flujos dependientes de varios endpoints, validaciones en cascada, o riesgo UX elevado. | Checkout o actualización masiva del carrito |

---

## 4️⃣ Ejemplo aplicado

**Issue:** `UI – Actualizar cantidad de un ítem`

| Factor | Análisis | Resultado |
|:--------|:----------|:-----------|
| Complejidad | 1 componente principal + botones +/– + integración con API. | Tamaño **M** |
| Tiempo estimado | Implementar, probar, integrar y documentar ≈ 4h. | **4 horas** |
| Riesgo | Interacción directa con backend, posible error en actualización visual. | **Medio** |

---

## 5️⃣ Buenas prácticas para planificación frontend

- Mantener coherencia visual con los componentes existentes (Design System o Material UI).  
- Al definir issues, incluir capturas o mockups cuando el tamaño sea **M o L**.  
- Validar interacciones con *API mocks* antes de integración real.  
- Documentar el comportamiento esperado de feedback visual (loading, error, success).  
- Revisar los riesgos UX antes del cierre (cambios en flujo del usuario).  

---

## 6️⃣ Plantilla recomendada para incluir en cada issue

```markdown
### Parámetros de planificación
| Tamaño | Estimación | Riesgo |
|:-------|:------------|:--------|
| M | 4 horas | Medio |
