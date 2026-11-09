# Seguridad

Registro de las medidas de seguridad del proyecto. Sirve como evidencia de debida
diligencia (riesgo R7 y requisito RNF-08 del [plan de gestión](plan-de-gestion.md))
y como guía para quien mantenga el sitio.

> **Este documento no contiene secretos.** Contraseñas, claves y códigos de
> recuperación se guardan fuera del repositorio, en soporte offline o en un gestor
> de contraseñas. El repositorio es público.

## 1. Cuentas del proyecto (NR-51)

Verificación en dos pasos (2FA) con app autenticadora; el SMS solo como respaldo.

| Servicio | Uso en el proyecto | Titular actual | 2FA | Respaldo | Verificado |
|---|---|---|---|---|---|
| GitHub | Código y control de versiones | Desarrolladora | App autenticadora | Códigos de recuperación | 07/11/2026 |
| Atlassian (Jira) | Gestión del proyecto | Desarrolladora | App autenticadora | Código de recuperación | 07/11/2026 |
| Netlify | Publicación del sitio | Desarrolladora | App autenticadora | Códigos de recuperación | 07/11/2026 |
| GoDaddy | Registro del dominio | Desarrolladora (traspaso en NR-57) | App autenticadora | SMS | 07/11/2026 |
| Google | Search Console y Perfil de Empresa | Natalia, administrada por la desarrolladora hasta el traspaso (NR-57) | App autenticadora | Códigos alternativos | 08/11/2026 |
| MongoDB Atlas | Base de datos | Natalia (NR-17) | Pendiente | — | — |
| Cloudinary | Imágenes | Natalia (NR-17) | Pendiente | — | — |

**Mínimo privilegio:** la app GitHub for Atlassian tiene acceso solo a este
repositorio. Las cuentas de Natalia se traspasan con acceso delegado para la
desarrolladora, sin compartir contraseñas (NR-57).

## 2. Dominio `nataliariopedre.com`

| Medida | Estado | Verificado |
|---|---|---|
| Bloqueo de transferencia (Domain lock) | Activado | 07/11/2026 |
| Privacidad WHOIS (Domains By Proxy) | Activada | 07/11/2026 |
| Renovación automática (vence 26/08/2027) | Activada | 07/11/2026 |
| Recordatorio de revisión de la renovación | Agendado para el 02/08/2027 | 07/11/2026 |

## 3. Repositorio

| Medida | Detalle | Verificado |
|---|---|---|
| Protección de `main` | Ruleset `proteger-main`: cambios solo por pull request, sin borrado ni force push, sin excepciones (NR-18) | 07/11/2026 |
| Revisión del historial antes de hacerlo público | 66 commits revisados: sin contraseñas, claves ni archivos `.env` | 06/11/2026 |
| `.gitignore` | Excluye `.env`, archivos de claves y archivos con "recovery" o "secret" en el nombre | 08/11/2026 |
| Mail de la autora | Commits firmados con la dirección `noreply` de GitHub; GitHub bloquea los pushes que expongan el mail personal | 07/11/2026 |

## 4. Pendiente

Según el plan de gestión (sprint 7 y hito H7): cabeceras de seguridad, auditoría
de dependencias, backup de la base de datos, registro de actividad del panel y
revisión OWASP Top 10 (NR-56).
