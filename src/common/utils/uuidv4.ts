// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

const lut: string[] = [];
const random = Math.random;

for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

const uuidv4 = () => {
    // tslint:disable
    const d0 = (random() * 0xffffffff) | 0;
    const d1 = (random() * 0xffffffff) | 0;
    const d2 = (random() * 0xffffffff) | 0;
    const d3 = (random() * 0xffffffff) | 0;
    return (
        lut[d0 & 0xff] +
        lut[(d0 >> 8) & 0xff] +
        lut[(d0 >> 16) & 0xff] +
        lut[(d0 >> 24) & 0xff] +
        '-' +
        lut[d1 & 0xff] +
        lut[(d1 >> 8) & 0xff] +
        '-' +
        lut[((d1 >> 16) & 0x0f) | 0x40] +
        lut[(d1 >> 24) & 0xff] +
        '-' +
        lut[(d2 & 0x3f) | 0x80] +
        lut[(d2 >> 8) & 0xff] +
        '-' +
        lut[(d2 >> 16) & 0xff] +
        lut[(d2 >> 24) & 0xff] +
        lut[d3 & 0xff] +
        lut[(d3 >> 8) & 0xff] +
        lut[(d3 >> 16) & 0xff] +
        lut[(d3 >> 24) & 0xff]
    );
};

export default uuidv4;
