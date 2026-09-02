# 🚀 Mi Prime Tracker

> **31 Días Para Mi Prime** — Una aplicación web moderna para la creación, seguimiento y consistencia de hábitos diarios, potenciada por una arquitectura serverless en la nube.

---

## 📌 Descripción

**Mi Prime Tracker** es una herramienta interactiva diseñada para ayudarte a construir disciplina y monitorear tus metas diarias. Permite gestionar hábitos personalizados, registrar el progreso diario en una grilla visual e incluir notas mensuales de enfoque (*"Hacer Más / Hacer Menos"*). 

Cuenta con autenticación de usuarios y persistencia de datos en tiempo real mediante **Supabase**, garantizando que tu progreso esté accesible de forma segura desde cualquier dispositivo.

---

## ✨ Características Principales

* 🔒 **Autenticación Segura:** Sistema de registro, inicio de sesión y gestión de sesiones mediante Supabase Auth.
* 📅 **Grilla Interactiva de Hábitos:** Seguimiento visual mensual por estados (completado, fallido, neutral).
* ⚡ **Actualización Optimista:** Experiencia de usuario fluida con respuestas instantáneas en la UI.
* 📝 **Notas de Enfoque Mensual:** Secciones dedicadas a reflexionar sobre qué hábitos incrementar o reducir cada mes, con guardado automático (*debounced*).
* 🛡️ **Seguridad a Nivel de Filas (RLS):** Cada usuario tiene acceso exclusivo y privado únicamente a sus propios datos.
* 🎨 **Interfaz Moderna & Responsiva:** Diseñada con Tailwind CSS para una experiencia visual oscura y limpia (*Dark Mode*).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React 18, Vite |
| **Estilos** | Tailwind CSS, Lucide Icons |
| **Backend & Base de Datos** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth (JWT) |
| **Despliegue** | Vercel / Netlify *(o la plataforma que utilices)* |


