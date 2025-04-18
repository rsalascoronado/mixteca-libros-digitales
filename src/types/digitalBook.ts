
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
  }
];
