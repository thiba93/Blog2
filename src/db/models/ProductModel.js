// eslint-disable-next-line max-classes-per-file
import BaseModel from "@/db/models/BaseModel"
import CategoryModel from "@/db/models/CategoryModel"

class ProductModel extends BaseModel {
  static tableName = "products"
  static relationMappings = {
    category: {
      modelClass: CategoryModel,
      relation: BaseModel.BelongsToOneRelation,
      join: {
        from: "products.categoryId",
        to: "categories.id",
      },
    },
  }
}

export default ProductModel
