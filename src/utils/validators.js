import { string } from "yup"

export const nameValidator = string().min(3).required()

export const descriptionValidator = string().min(20)
