import { ExecutionContext } from 'graphql/execution/execute';
import { GraphQLMutation, GraphQLQuery } from '../graphQLTypes';

export const StockTitleResolver = {
    Query: {
        getStockTitles: async (parent: any, args: GraphQLQuery) => {
           return []
        },
    }
}
