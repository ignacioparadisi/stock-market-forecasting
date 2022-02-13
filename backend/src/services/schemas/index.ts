import { mergeTypeDefs } from "@graphql-tools/merge";
import { StockTitleTypeDef  } from "@Services/schemas/StockTitle";

export const typeDefs = mergeTypeDefs([
    StockTitleTypeDef,
])