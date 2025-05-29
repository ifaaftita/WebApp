// Company Information
export const companyInfo = {
  name: "Mon Entreprise",
  address: "22, Avenue Voltaire",
  city: "13000 Marseille",
  siret: "123456789",
  tva: "FRXX999999999",
  phone: "+216 20 829 991",
  email: "contact@monentreprise.com",
  insuranceType: "CNAM"
};

// TVA Configuration
export const tvaConfig = {
  rate: 0.19, // 19% TVA
  label: "TVA 19%"
};

export const initialInvoices = [
  { 
    id: 1, 
    invoiceNumber: 'FAC-2023-001', 
    date: '2023-01-15', 
    client: 'AMIRA MKADDEMI', 
    total: 120.000,
    discount: {
      percentage: 10,
      amount: 12.000
    },
    amountDue: 108.000,
    status: 'payé',
    paymentMethod: 'Espèces'
  },
  { 
    id: 2, 
    invoiceNumber: 'FAC-2023-002', 
    date: '2023-02-20', 
    client: 'KENZA ROKH', 
    total: 850.500,
    discount: {
      percentage: 5,
      amount: 42.525
    },
    amountDue: 807.975,
    status: 'non payé',
    paymentMethod: ''
  },
  { 
    id: 3, 
    invoiceNumber: 'FAC-2023-003', 
    date: '2023-03-10', 
    client: 'YASSINE LAMRANI', 
    total: 500.000,
    discount: {
      percentage: 0,
      amount: 0.000
    },
    amountDue: 500.000,
    status: 'avance-chèque',
    paymentMethod: 'Chèque'
  }
];

export const statusOptions = ['payé', 'non payé', 'avance-chèque'];
export const paymentMethods = ['Espèces', 'Chèque', 'Carte Bancaire', 'Virement'];

export const statusFilters = [
  { value: 'all', label: 'Toutes les Factures' },
  { value: 'payé', label: 'Payé' },
  { value: 'non payé', label: 'Non Payé' },
  { value: 'avance-chèque', label: "Avance-Chèque" }
]; 