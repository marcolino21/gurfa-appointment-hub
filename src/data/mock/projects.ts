
import { Project, ProjectCategory } from '@/types';

// Mock project categories
export const MOCK_PROJECT_CATEGORIES: Record<string, ProjectCategory[]> = {
  'sa1': [
    { id: 'cat1', name: 'Parrucchiere', salonId: 'sa1' },
    { id: 'cat2', name: 'Unghie', salonId: 'sa1' },
    { id: 'cat3', name: 'Sopracciglia e Ciglia', salonId: 'sa1' },
    { id: 'cat4', name: 'Massaggi', salonId: 'sa1' },
    { id: 'cat5', name: 'Barbiere', salonId: 'sa1' },
    { id: 'cat6', name: 'Epilazione', salonId: 'sa1' },
    { id: 'cat7', name: 'Trattamenti Viso', salonId: 'sa1' },
    { id: 'cat8', name: 'Filler', salonId: 'sa1' },
    { id: 'cat9', name: 'Trattamenti Corpo', salonId: 'sa1' },
    { id: 'cat10', name: 'Tatuaggi e Piercing', salonId: 'sa1' },
    { id: 'cat11', name: 'Trucco', salonId: 'sa1' },
    { id: 'cat12', name: 'Medicina e Odontoiatria', salonId: 'sa1' },
    { id: 'cat13', name: 'Counseling e Olistica', salonId: 'sa1' },
    { id: 'cat14', name: 'Fitness', salonId: 'sa1' },
  ],
};

// Mock project subcategories
export const MOCK_PROJECT_SUBCATEGORIES: Record<string, ProjectCategory[]> = {
  'cat1': [
    { id: 'subcat1', name: 'Taglio Donna', parentId: 'cat1', salonId: 'sa1' },
    { id: 'subcat2', name: 'Colorazione', parentId: 'cat1', salonId: 'sa1' },
    { id: 'subcat3', name: 'Piega e Styling', parentId: 'cat1', salonId: 'sa1' },
  ],
  'cat2': [
    { id: 'subcat4', name: 'Manicure', parentId: 'cat2', salonId: 'sa1' },
    { id: 'subcat5', name: 'Pedicure', parentId: 'cat2', salonId: 'sa1' },
    { id: 'subcat6', name: 'Nail Art', parentId: 'cat2', salonId: 'sa1' },
  ],
  'cat7': [
    { id: 'subcat7', name: 'Pulizia Viso', parentId: 'cat7', salonId: 'sa1' },
    { id: 'subcat8', name: 'Anti-Age', parentId: 'cat7', salonId: 'sa1' },
    { id: 'subcat9', name: 'Idratazione', parentId: 'cat7', salonId: 'sa1' },
  ],
};

// Mock projects
export const MOCK_PROJECTS: Record<string, Project[]> = {
  'sa1': [
    {
      id: 'p1',
      title: 'Pacchetto Ringiovanimento Viso',
      clientId: 'c1',
      categoryId: 'cat7',
      subcategoryId: 'subcat8',
      description: 'Serie di trattamenti mirati a ringiovanire il viso della cliente',
      objectives: [
        {
          id: 'o1',
          description: 'Prima seduta di pulizia profonda',
          isCompleted: true,
          completedAt: '2025-03-15',
          projectId: 'p1'
        },
        {
          id: 'o2',
          description: 'Seconda seduta con maschera anti-age',
          isCompleted: true,
          completedAt: '2025-03-29',
          projectId: 'p1'
        },
        {
          id: 'o3',
          description: 'Terza seduta con trattamento idratante',
          isCompleted: false,
          projectId: 'p1'
        }
      ],
      startDate: '2025-03-10',
      endDate: '2025-05-10',
      status: 'in_progress',
      progress: 66,
      feedback: 'La cliente sta notando miglioramenti nella luminosità della pelle',
      staffIds: ['staff1', 'staff3'],
      attachments: [
        {
          id: 'a1',
          name: 'Prima del trattamento.jpg',
          url: '/uploads/prima_trattamento.jpg',
          type: 'image/jpeg',
          size: 1024000,
          uploadedAt: '2025-03-10',
          projectId: 'p1'
        }
      ],
      customFields: [
        {
          id: 'cf1',
          name: 'Tipo di pelle',
          type: 'select',
          value: 'Secca',
          options: ['Secca', 'Grassa', 'Mista', 'Normale']
        },
        {
          id: 'cf2',
          name: 'Allergie',
          type: 'text',
          value: 'Nessuna'
        }
      ],
      salonId: 'sa1',
      createdAt: '2025-03-05',
      updatedAt: '2025-04-01'
    },
    {
      id: 'p2',
      title: 'Programma Colore Personalizzato',
      clientId: 'c2',
      categoryId: 'cat1',
      subcategoryId: 'subcat2',
      description: 'Serie di colorazioni personalizzate per ottenere gradualmente il biondo desiderato',
      objectives: [
        {
          id: 'o4',
          description: 'Prima decolorazione leggera',
          isCompleted: true,
          completedAt: '2025-02-20',
          projectId: 'p2'
        },
        {
          id: 'o5',
          description: 'Seconda decolorazione con toner',
          isCompleted: false,
          projectId: 'p2'
        },
        {
          id: 'o6',
          description: 'Trattamento finale con tonalizzante',
          isCompleted: false,
          projectId: 'p2'
        }
      ],
      startDate: '2025-02-15',
      endDate: '2025-05-15',
      status: 'in_progress',
      progress: 33,
      staffIds: ['staff2'],
      attachments: [],
      customFields: [
        {
          id: 'cf3',
          name: 'Colore di partenza',
          type: 'text',
          value: 'Castano scuro'
        },
        {
          id: 'cf4',
          name: 'Colore desiderato',
          type: 'text',
          value: 'Biondo chiaro'
        }
      ],
      salonId: 'sa1',
      createdAt: '2025-02-10',
      updatedAt: '2025-02-25'
    },
    {
      id: 'p3',
      title: 'Percorso Ristrutturazione Unghie',
      clientId: 'c3',
      categoryId: 'cat2',
      subcategoryId: 'subcat4',
      description: 'Trattamento ristrutturante per unghie danneggiate da gel precedente',
      objectives: [
        {
          id: 'o7',
          description: 'Rimozione gel precedente e valutazione danni',
          isCompleted: true,
          completedAt: '2025-01-10',
          projectId: 'p3'
        },
        {
          id: 'o8',
          description: 'Prima applicazione trattamento rinforzante',
          isCompleted: true,
          completedAt: '2025-01-24',
          projectId: 'p3'
        },
        {
          id: 'o9',
          description: 'Seconda applicazione trattamento',
          isCompleted: true,
          completedAt: '2025-02-07',
          projectId: 'p3'
        },
        {
          id: 'o10',
          description: 'Valutazione finale e applicazione gel delicato',
          isCompleted: true,
          completedAt: '2025-02-21',
          projectId: 'p3'
        }
      ],
      startDate: '2025-01-05',
      endDate: '2025-02-25',
      status: 'completed',
      progress: 100,
      feedback: 'Cliente molto soddisfatta, unghie completamente ripristinate',
      staffIds: ['staff3'],
      attachments: [
        {
          id: 'a2',
          name: 'Prima.jpg',
          url: '/uploads/unghie_prima.jpg',
          type: 'image/jpeg',
          size: 842000,
          uploadedAt: '2025-01-05',
          projectId: 'p3'
        },
        {
          id: 'a3',
          name: 'Dopo.jpg',
          url: '/uploads/unghie_dopo.jpg',
          type: 'image/jpeg',
          size: 921000,
          uploadedAt: '2025-02-25',
          projectId: 'p3'
        }
      ],
      customFields: [],
      salonId: 'sa1',
      createdAt: '2025-01-03',
      updatedAt: '2025-02-25'
    }
  ]
};
