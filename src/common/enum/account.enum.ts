

export enum  enumStatusAccount{
    ACTIVE = "active",
    BLOCKED = "blocked"
}

export enum  enumCurrency{
    EGP = "EGP",
    USD = "USD"
}

export const GenerateAccountNumber = () => {
    const prefix = "123"
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000)
    return `${prefix}${randomNumber}`
}