export function slop(y: number[], x: number[]): number {
    const n = y.length;
    let sumX = 0;
    let sumY = 0;
    let sumXy = 0;
    let sumXx = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXy += x[i] * y[i];
        sumXx += x[i] * x[i];
    }
    return (n * sumXy - sumX * sumY) / (n * sumXx - sumX * sumX);
}
