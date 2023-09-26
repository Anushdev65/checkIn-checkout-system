import { Auth } from "../schemasModel/model.js";

export const AddAuthUserService = async ({ body }) => Auth.create(body);

export const listAllAuthUserService = async ({
  find = {},
  sort = "",
  limit = "",
  skip = "",
  select = "",
}) => Auth.find(find).sort(sort).limit(limit).skip(skip).select(select);

export const detailSpecificAuthUserService = async (id) => Auth.findById(id);

export const detailSpecificAuthUserByAny = async ({ email }) =>
  Auth.findOne({ email });

export const editSpecificAuthUserService = async ({ id, body }) =>
  Auth.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

export const deleteSpecficAuthUserService = async ({ id }) =>
  Auth.findByAndDelete(id);
