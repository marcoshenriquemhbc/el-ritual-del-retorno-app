/**
 * CONTENT MANIFEST — El Ritual del Retorno
 * Define la lista de módulos y bonos que aparecen en la vista "Curso".
 * El contenido real vive en archivos .md dentro de /content/, y se
 * carga con fetch() solo cuando el usuario abre cada item (lazy load).
 */
window.CURSO_MANIFEST = [
  {
    id: 'modulo-1',
    kind: 'article',
    section: 'modulo',
    title: 'Introducción',
    hint: 'Bienvenida al método',
    path: '/content/01-introduccion.md',
  },
  {
    id: 'modulo-2',
    kind: 'article',
    section: 'modulo',
    title: 'Preparación',
    hint: 'El estado correcto antes del ritual',
    path: '/content/02-preparacion.md',
  },
  {
    id: 'modulo-3',
    kind: 'article',
    section: 'modulo',
    title: 'El Ritual',
    hint: 'El paso a paso principal',
    path: '/content/03-el-ritual.md',
  },
  {
    id: 'modulo-4',
    kind: 'article',
    section: 'modulo',
    title: 'Después del Ritual',
    hint: 'Señales y lectura del proceso',
    path: '/content/04-despues-del-ritual.md',
  },
  {
    id: 'bono-mejora-personal',
    kind: 'collection',
    section: 'bono',
    title: 'Mejora Personal',
    hint: '11 guías complementarias',
    children: [
      { id: 'mp-01', title: 'Cómo el Rechazo Afecta tu Mente', path: '/content/mejora-personal/01.md' },
      { id: 'mp-02', title: 'Qué Crea Realmente la Atracción', path: '/content/mejora-personal/02.md' },
      { id: 'mp-03', title: 'Cómo Recuperar la Autoestima Después de una Pérdida', path: '/content/mejora-personal/03.md' },
      { id: 'mp-04', title: 'Cómo Recuperar tu Energía Después de una Separación', path: '/content/mejora-personal/04.md' },
      { id: 'mp-05', title: 'Los Comportamientos que Disminuyen tu Atracción', path: '/content/mejora-personal/05.md' },
      { id: 'mp-06', title: 'Los Estilos Emocionales que Influyen en las Relaciones', path: '/content/mejora-personal/06.md' },
      { id: 'mp-07', title: 'El Ciclo Invisible que Destruye Conexiones', path: '/content/mejora-personal/07.md' },
      { id: 'mp-08', title: 'El Despertar del Desapego Estratégico', path: '/content/mejora-personal/08.md' },
      { id: 'mp-09', title: 'El Plan de Magnetismo de 21 Días', path: '/content/mejora-personal/09.md' },
      { id: 'mp-10', title: 'El Poder de la Identidad Emocional', path: '/content/mejora-personal/10.md' },
      { id: 'mp-11', title: 'Cómo Volver a Ser una Persona Interesante para Ti Misma', path: '/content/mejora-personal/11.md' },
    ],
  },
  {
    id: 'bono-banos',
    kind: 'article',
    section: 'bono',
    title: 'Baños de Magnetismo y Reconexión',
    hint: 'Para activar tu energía irresistible',
    path: '/content/banos-de-magnetismo-y-reconexion.md',
  },
  {
    id: 'bono-escudo',
    kind: 'article',
    section: 'bono',
    title: 'Ritual del Escudo de la Reconexión',
    hint: 'Protección de tu campo emocional',
    path: '/content/ritual-del-escudo-de-la-reconexion.md',
  },
  {
    id: 'bono-suenos',
    kind: 'article',
    section: 'bono',
    title: 'Cómo Aparecer en sus Sueños',
    hint: 'Activación sutil de presencia',
    path: '/content/como-aparecer-en-sus-suenos.md',
  },
  {
    id: 'bono-secreto',
    kind: 'link',
    section: 'bono',
    title: 'IA Consejera Amorosa Personal',
    hint: 'Bono secreto — acceso externo',
    url: 'https://gemini.google.com/gem/1HHbh_PyizU_eu8fhdpTCBL_HDmIWlqO-?usp=sharing',
  },
];
