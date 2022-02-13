import { mergeResolvers } from "@graphql-tools/merge";
import { StockTitleResolver } from '@Services/resolvers/StockTitle'

export const resolvers = mergeResolvers([
    StockTitleResolver
])