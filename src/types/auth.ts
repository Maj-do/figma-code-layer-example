export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isProfessional?: boolean;
  siret?: string;
}

export interface MockAccount extends User {
  password: string;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'test@example.com',
    password: 'Test1234',
    firstName: 'Marie',
    lastName: 'Dupont',
    phone: '06 12 34 56 78',
  },
];

export function mockLogin(email: string, password: string): User | null {
  const account = MOCK_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );
  if (!account) return null;
  const { password: _, ...user } = account;
  return user;
}
