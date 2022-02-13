import { gql } from 'apollo-server';

export const StockTitleTypeDef = gql`
    type StockTitle {
        id: Int
        name: String
        symbol: String
        stockAmount: Int
        createdAt: String
        isinCode: String
    }

    input StockTitleInput {
        id: Int
        name: String
        symbol: String
        isinCode: String
        createdAt: String
    }

    type Query {
        getStockTitles(where: StockTitleInput, skip: Int, limit: Int): [StockTitle]
    }
`