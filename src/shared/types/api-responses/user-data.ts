import { KycProvider, Tier } from 'src/shared/enums'

interface StructuredAddress {
  country: string
  formatted: string
  locality: string
  postal_code: string
  region: string
  street_address: string
}

interface UserData {
  birth_date: string
  email: string
  first_name: string
  given_name: string
  full_name: string
  family_name: string
  userhash: string
  iban: string
  structured_address: StructuredAddress
  place_of_birth: string
  nationalities: string[]
  tier: Tier
  provider: KycProvider
}

export default UserData
