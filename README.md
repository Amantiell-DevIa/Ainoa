# Para Ainoa

Una dedicatoria pensada para móvil: flores amarillas en 3D, nuestra foto y una carta de amor en una segunda sección turquesa.

## Desarrollo

Usa Node.js 22.12 o posterior (también es compatible Node 20.19 o posterior).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run lint
npm run preview
```

La compilación genera `dist/`. La configuración de Vite utiliza rutas relativas para los recursos compilados.

## Contenido

- La aplicación activa comienza en `src/main.tsx` y `src/App.tsx`.
- La foto está en `public/images/ainoayyo.jpg`; su configuración y las dedicatorias de las flores están en `src/config/photoConfig.ts`.
- La carta, su título y la animación de escritura están en `src/components/LoveLetter.tsx`.
- La acuarela, los adornos y los brillos están en `src/components/LoveLetter.css`.

El enlace «Una carta para ti» lleva a la sección inferior. Al entrar, aparece el título y comienza la escritura. «Leer carta completa» permite mostrar el resto al instante. El control de pausa permite detener y reanudar la escritura y los brillos. El espacio del texto está reservado para evitar saltos mientras se escribe.

La carta y sus adornos se pausan al salir de la sección o al ocultar la pestaña. Con movimiento reducido, el texto se muestra completo y los brillos permanecen quietos. El ramo deja de renderizar mientras queda fuera de pantalla para facilitar la lectura en móvil.

El título «Feliz 3 meses Amor» celebra los tres meses mencionados en la carta.
