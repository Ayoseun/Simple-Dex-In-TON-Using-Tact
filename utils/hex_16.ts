export function generateLargeHex(): string {
    let result = '';
    const hexChars = '0123456789abcdef';
    for (let i = 0; i < 64; i++) {
        result += hexChars[Math.floor(Math.random() * 16)];
    }
    return '0x' + result;
}

const randomLargeHex = generateLargeHex();
export const bigIntValue = BigInt(randomLargeHex);