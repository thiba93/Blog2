import { number, string } from "yup"

export const nameValidator = string().min(3)

export const descriptionValidator = string().min(20)

export const idValidator = number().min(1)

export const pageValidator = number().min(1).default(1).required()
