export interface Province {
  code: string
  name: string
  name_with_type: string
  type: string
  slug: string
}

export interface District {
  code: string
  name: string
  name_with_type: string
  type: string
  slug: string
  path: string
  path_with_type: string
  parent_code: string
}

export interface Ward {
  code: string
  name: string
  name_with_type: string
  type: string
  slug: string
  path: string
  path_with_type: string
  parent_code: string
}

declare module '@ltv/vn-address' {
  export const provinces: Province[]
  export const districts: {
    districts: District[]
    getDistricts: (provinceCode: string) => District[]
  }
  export const wards: {
    getWards: (districtCode: string) => Ward[]
  }
}
