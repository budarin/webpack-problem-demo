interface IHash<T> {
    [key: string]: T;
}

interface IAnyHash {
    [key: string]: unknown;
}

interface IStringHash {
    [key: string]: string;
}

interface IBooleanHash {
    [key: string]: boolean;
}
