// @flow

export type vendor = {
  vendorID: number,
	vendorName: string,
	contactName: string,
  phone: string,
  altPhone: [string],
  address: string,
  city: string,
  state: string,
  zip: number
  products: [number] // An array of itemID's
}

export type item = {
  itemID: number,
  itemName: string,
  location: string,
  vendorID: number
}
