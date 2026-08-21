export type Role = 'Student' | 'Zaměstnanec' | 'Učitel'

export type Person = {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  birthDate: string
  trida: string
  rocnik: string
  prukaz: string
  status: 'Kompletní' | 'Nedokončeno'
  platba: 'Zaplaceno' | 'Nezaplaceno'
  smazeSeZa: string
  price: string
  ready: boolean
  // Added after the August 2026 Figma update, which introduced a "Role" column
  // on Přípravna dat (not every person in the system is a student) and started
  // tracking legal-guardian / photo / student-status flags per person.
  role: Role
  zastupceJmeno: string | null
  hasPhoto: boolean
  aktivniStudent: boolean
  absolvent: boolean
  cardNumber: string
  cardExpiry: string
}

// Mirrors the columns of the real "Příprava dat" table from the Figma prototype
// (Jméno / Narozen / Třída / Ročník / Průkaz / Role / Status / Platba / Smaže se za), plus
// firstName/lastName/email used by the "Importované osoby" modal on Výsledek kontroly.
const RAW: Array<[string, string, string, string, string, string, string, string, string, Role, string | null, boolean]> = [
  ['Prokop', 'Diviš', 'prokop@prokop.cz', '1/11/2050', '1A', '1.', '-', 'Nedokončeno', 'Zaplaceno', 'Student', null, true],
  ['Božena', 'Němcová', 'bozena.nemcova@gmail.com', '1/11/2050', '1A', '1.', '-', 'Nedokončeno', 'Nezaplaceno', 'Zaměstnanec', 'Božena Němcová', false],
  ['Karel', 'Havlíček', 'havlicek@gmail.com', '1/11/2050', '1A', '1.', '-', 'Nedokončeno', 'Nezaplaceno', 'Učitel', null, false],
  ['Bedřich', 'Smetana', 'beda.smetana76@seznam.cz', '1/11/2050', '2B', '2.', 'ISIC', 'Kompletní', 'Zaplaceno', 'Student', null, true],
  ['Ema', 'Destinová', 'evka@seznam.cz', '1/11/2050', '2B', '2.', 'ISIC', 'Kompletní', 'Nezaplaceno', 'Student', 'Jana Destinová', false],
  ['Václav', 'Havel', 'pravdalaska@vitezi.cz', '1/11/2050', '2B', '2.', 'ISIC', 'Kompletní', 'Zaplaceno', 'Student', 'Václav Havel', false],
  ['Václav', 'Boudník', 'vasek@gmail.com', '1/11/2050', '2B', '2.', 'ISIC', 'Kompletní', 'Nezaplaceno', 'Student', 'Jan Boudník', false],
  ['Jaroslav', 'Seifert', 'jarekjarek@gmail.com', '1/11/1989', '2B', '2.', 'ISIC', 'Kompletní', 'Zaplaceno', 'Student', null, true],
  ['Dominik', 'Hašek', 'dominator98@gmail.com', '1/11/2050', '2B', '2.', 'ISIC', 'Kompletní', 'Nezaplaceno', 'Student', null, true],
  ['Anna', 'Nováková', 'anna.novakova@gmail.com', '1/11/2050', '3A', '3.', 'ISIC', 'Kompletní', 'Zaplaceno', 'Student', null, true],
]

export const samplePeople: Person[] = RAW.map(
  ([firstName, lastName, email, birthDate, trida, rocnik, prukaz, status, platba, role, zastupceJmeno, hasPhoto], i) => ({
    id: i + 1,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email,
    birthDate,
    trida,
    rocnik,
    prukaz,
    status: status as Person['status'],
    platba: platba as Person['platba'],
    smazeSeZa: '15 dní',
    price: '55,00 Kč',
    ready: status === 'Kompletní',
    role,
    zastupceJmeno,
    hasPhoto,
    aktivniStudent: role === 'Student',
    absolvent: false,
    cardNumber: `4444${5550000 + i * 137}`,
    cardExpiry: prukaz === '-' ? '—' : '31.08.2026',
  }),
)
