# Modelos humanos anatómicos para página de cirugía plástica

Archivos listos para reemplazar tus componentes actuales de React Three Fiber.

## Qué cambia

- `BodyContourViewer.tsx`: cuerpo humano completo más proporcionado, con torso, cuello, cabeza, brazos, piernas, prendas clínicas, zonas de tratamiento, marcas quirúrgicas y vista antes/simulación.
- `BreastHarmonyViewer.tsx`: torso superior más humano, pectoral, tejido mamario, implante translúcido, surco, areola discreta, marcas de mastopexia/reducción y prendas clínicas.
- `FacialProfileViewer.tsx`: perfil lateral más anatómico, con cráneo, nariz, labios, mentón, cuello, oreja, ojo y líneas de referencia.
- `index.ts`: mantiene exports existentes y añade `ProcessTimeline3D`.

## Nota sobre el ZIP 3D original

El archivo `dc87644wmnsw-3dmfemale3.zip` trae un modelo `.3ds`, un formato antiguo. Para web moderna conviene convertirlo a `.glb` o `.gltf` antes de integrarlo. Estos componentes no dependen de ese modelo, así evitas problemas de carga, licencias/texturas viejas y peso innecesario.

## Instalación

Copia estos archivos en la misma carpeta donde tenías tus visores 3D. Si tu proyecto ya usaba los componentes anteriores, no deberías cambiar las importaciones principales.

Dependencias esperadas:

```bash
npm install three @react-three/fiber @react-three/drei
```
