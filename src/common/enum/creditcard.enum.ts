


export enum cardType {
    visa = "visa",
    mastercard = "mastercard",
    
}

export enum cardStatus {
    active = "active",
    blocked = "blocked",
    
}


export const generateCardNumber = (): string => {
  const prefix = "4" // 4 = Visa, 5 = Mastercard
  const random = Math.floor(Math.random() * 1e15).toString().padStart(15, "0")
  return `${prefix}${random}`.slice(0, 16)
}