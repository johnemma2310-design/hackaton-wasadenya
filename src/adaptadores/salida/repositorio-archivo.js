/**
 * ADAPTADOR DE SALIDA · repositorio en un archivo JSON                     (ETAPA 2 · tu trabajo)
 *
 * Cumple EL MISMO puerto que el de memoria, pero guarda las evaluaciones en un archivo: un arreglo JSON.
 * Así los datos sobreviven a un reinicio del servidor (y, en la Etapa 6, a un contenedor nuevo).
 *
 *   crearRepositorioArchivo('/ruta/evaluaciones.json')
 *
 * Detalles que las pruebas comprueban:
 *   · si el archivo todavía no existe, `listar()` devuelve [] (no es un error);
 *   · al guardar por primera vez se crea el archivo… y también su carpeta, si hace falta (mira mkdirSync con { recursive: true });
 *   · otra instancia apuntando al mismo archivo ve lo que guardó la primera;
 *   · las mismas reglas del contrato que el de memoria (ids, copias, orden).
 *
 * Usa node:fs en su versión síncrona (readFileSync, writeFileSync, existsSync, mkdirSync) y node:path.
 *
 * Comprueba con:   npm run verificar -- 2
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function crearRepositorioArchivo(ruta) {
  // Se lee el archivo en cada operación: así otra instancia (u otro contenedor) ve siempre lo último guardado.
  const leer = () => (existsSync(ruta) ? JSON.parse(readFileSync(ruta, 'utf8')) : []);
  const escribir = (lista) => {
    mkdirSync(dirname(ruta), { recursive: true });
    writeFileSync(ruta, JSON.stringify(lista, null, 2));
  };

  return {
    listar() {
      return leer();
    },
    obtener(id) {
      return leer().find((e) => e.id === id);
    },
    guardar(evaluacion) {
      const lista = leer();
      if (evaluacion.id === undefined || evaluacion.id === null) {
        const id = lista.reduce((mayor, e) => Math.max(mayor, e.id), 0) + 1;
        const nueva = { ...evaluacion, id };
        escribir([...lista, nueva]);
        return { ...nueva };
      }
      const i = lista.findIndex((e) => e.id === evaluacion.id);
      if (i === -1) lista.push({ ...evaluacion });
      else lista[i] = { ...evaluacion };
      escribir(lista);
      return { ...evaluacion };
    },
    eliminar(id) {
      const lista = leer();
      const quedan = lista.filter((e) => e.id !== id);
      if (quedan.length === lista.length) return false;
      escribir(quedan);
      return true;
    },
  };
}
