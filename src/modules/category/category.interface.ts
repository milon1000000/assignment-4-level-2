export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface IUpdateCategory{
    name?:string;
    description?:string
}