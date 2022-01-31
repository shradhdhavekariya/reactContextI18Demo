import { UserData } from 'src/shared/types/api-responses'

export const parseUserData = (entries: UserData) => ({
  email: entries.email,
  birthDate: entries.birth_date,
  firstName: entries.first_name,
  givenName: entries.given_name,
  fullName: entries.full_name,
  familyName: entries.family_name,
  iban: entries.iban,
  address: entries.structured_address.formatted,
  structuredAddress: entries.structured_address,
  placeOfBirth: entries.place_of_birth,
  kycProvider: entries.provider,
  nationalities: entries.nationalities,
})
