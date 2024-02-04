import BaseModel from "@/db/models/BaseModel"
import ProductModel from "@/db/models/ProductModel"
import UserModel from "@/db/models/UserModel"

class CommentModel extends BaseModel {
  static tableName = "comments"
  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: ProductModel,
        join: {
          from: "comments.productId",
          to: "products.id",
        },
      },
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default CommentModel
