interface IApiRequest {
    id: string;
    ver: string;
    meta?: IHash<any>;
    method: string;
    params: IHash<any>;
}

interface IQueryRequest<T> {
    name: string;
    text: string;
    values: T[];
}

interface IDb {
    query: <E, T>(requestParams: IApiRequest) => Promise<TErrorOrResultObject<E, T>>;
    getActiveConnections: () => number;
    reset: () => void;
    end: () => void;
}
