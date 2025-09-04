# Flujo de Trabajo con Git: Ramas y Buenas Prácticas

Este documento describe un flujo basado en tres ramas principales (`main`, `test`, `dev`), convenciones de nombres para branches, contenido sugerido de las pull requests y comandos útiles.

---

## 📑 Índice

* [Ramas principales](#ramas-principales)
* [Estructura de Branches](#estructura-de-branches)
* [Contenido de la Descripción de Pull Request](#contenido-de-la-descripción-de-pull-request)
* [Comandos útiles de Git](#comandos-útiles-de-git)

## Ramas Principales

### 🚀 Main 
  - Rama de **producción**. Aquí solo llegan cambios probados y listos para desplegar.  

### 🧪 Test
  - Rama de integración. Se usa para validar nuevas funcionalidades y correcciones en un entorno de pruebas.  

### 🔧 Dev
  - Rama de desarrollo. Punto de partida para la mayoría de las tareas diarias. Contiene código en progreso y validado localmente. Puede ser inestable.

---

## Estructura de Branches

Todas las ramas de trabajo deben partir de `dev` y usar prefijos que describan su propósito:

- **feature/**  
  Para implementar nuevas funcionalidades.  
  Ejemplo: `feature/login` 

- **fix/**  
  Para corregir errores menores o ajustes de código sin urgencia.  
  Ejemplo: `fix/input-validation`  

- **hotfix/**  
  Para corregir errores críticos en producción que requieren despliegue inmediato.  
  Ejemplo: `hotfix/crash-on-startup`  

### Casos de uso

- **feature/**  
  Crear rutas de usuario, nuevas pantallas, módulos.  

- **fix/**  
  Ajustes en estilos, validaciones, refactorizaciones pequeñas.  

- **hotfix/**  
  Errores de seguridad, bloqueos de app, fallos en producción. Se mergea directamente a producción, solucionado el problema se actualizan las otras ramas.

---

## Contenido de la Descripción de Pull Request

Cada pull request debe incluir:

- Título breve y descriptivo  
- Resumen de cambios  
- Ticket o issue relacionado (si los hay)
- Detalles de la implementación (opcional, por ejemplo si hay que lanzar comandos npm)
- Pasos para probar (opcional)
- Capturas de pantalla (si aplica)  
- Notas extras

> _Nota: Al aceptar un PR es preferible usar **squash and merge** para unir todos los commits de la rama en un solo commit y que la rama principal quede más limpia._

---

## Comandos Útiles de Git

1. **Configuración inicial**  
   ```bash
   git config --global user.name "Fulano Letal"
   git config --global user.email "fulano@letal.com"
2. **Actualizar ramas locales**
    ```bash
    git clone https://url-del-repo.git
3. **Actualizar ramas locales**
    ```bash
    git fetch --all
    git pull origin dev
4. **Crear y cambiar de rama**
    ```bash
    git checkout dev
    git pull
    git checkout -b feature/autenticacion-oaut
5. **Hacer commits**
    ```bash
    git add .
    git commit -m "feat: agregar autenticacion OAuth"
6. **Sincronizar con rama remota**
    ```bash 
    git push -u origin feature/autenticacion-oauth
7. **Rebase interactivo**
    ```bash
    git checkout feature/autenticacion-oauth
    git rebase -i dev
8. **Merge de ramas**
    ```bash
    git checkout test
    git pull
    git merge --no-ff feature/autenticacion-oauth
    git push
9. **Eliminar rama remota tras mergear**
    ```bash
    git push origin --delete feature/autenticacion-oauth

---

> 📝 **Nota**: Esta guía está en constante evolución. Agregar o quitar sugerencias o mejoras.