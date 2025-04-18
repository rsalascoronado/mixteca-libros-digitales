
export interface DigitalBook {
  id: string;
  bookId: string;
  formato: 'PDF' | 'EPUB' | 'MOBI' | 'HTML';
  url: string;
  tamanioMb: number;
  fechaSubida: Date;
}

export const mockDigitalBooks: DigitalBook[] = [
  {
    id: '1',
    bookId: '1',
    formato: 'PDF',
    url: 'https://ejemplo.com/libros/calculo-stewart.pdf',
    tamanioMb: 15.4,
    fechaSubida: new Date('2023-03-15')
  },
  {
    id: '2',
    bookId: '2',
    formato: 'EPUB',
    url: 'https://ejemplo.com/libros/fisica-serway.epub',
    tamanioMb: 8.2,
    fechaSubida: new Date('2023-04-10')
  },
  {
    id: '3',
    bookId: '3',
    formato: 'PDF',
    url: 'https://ejemplo.com/libros/python-intro.pdf',
    tamanioMb: 12.7,
    fechaSubida: new Date('2023-02-28')
  },
  {
    id: '4',
    bookId: '4',
    formato: 'MOBI',
    url: 'https://ejemplo.com/libros/algoritmos-estructuras.mobi',
    tamanioMb: 6.8,
    fechaSubida: new Date('2024-01-15')
  },
  {
    id: '5',
    bookId: '5',
    formato: 'HTML',
    url: 'https://ejemplo.com/libros/web-development-guide.html',
    tamanioMb: 3.2,
    fechaSubida: new Date('2024-02-20')
  },
  {
    id: '6',
    bookId: '1',
    formato: 'EPUB',
    url: 'https://ejemplo.com/libros/calculo-stewart.epub',
    tamanioMb: 10.1,
    fechaSubida: new Date('2024-03-01')
  },
  {
    id: '7',
    bookId: '2',
    formato: 'MOBI',
    url: 'https://ejemplo.com/libros/fisica-serway.mobi',
    tamanioMb: 7.5,
    fechaSubida: new Date('2024-03-10')
  }
];

