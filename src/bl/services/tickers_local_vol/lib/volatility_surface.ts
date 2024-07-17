import { inv as matrixInv, multiply as matrixMultiply } from "mathjs";
function extrapolationByStrike(
    strike: number,
    coefMatrix: number[],
    len: number
) {
    let res = 0;
    for (let i = 0; i < len; i++) {
        res += Math.pow(strike, i) * coefMatrix[len - 1 - i];
    }
    return res;
}

function getInvMatrix(len: number, vec: number[]) {
    const matrix = new Array(len);
    for (let r = 0; r < len; r++) {
        matrix[r] = new Array(len);
        for (let j = 0; j < len; j++) {
            const c = len - j - 1;
            matrix[r][j] = Math.pow(vec[r], c);
        }
    }
    return matrixInv(matrix);
}
export class LocalVolatilitySurface {
    spot: number;
    days: number[];
    shareOfYear: number[] = [];
    strikes: number[];
    strikePrices: number[] = [];
    sourceItems: number[][] = [];

    step1: number[][] = [];
    step2: number[][] = [];
    step3: number[][] = [];
    step4: number[][] = [];
    step5: number[][] = [];
    step6: number[][] = [];
    step7: number[][] = [];
    step8: number[][] = [];

    riskFreeRates: number[];
    div: number[];

    constructor(arg: {
        spot: number;
        days: number[];
        strikes: number[];
        riskFreeRates: number[];
        div: number[];
        items: number[][];
    }) {
        this.spot = arg.spot;
        this.days = arg.days;
        this.strikes = arg.strikes;
        this.riskFreeRates = arg.riskFreeRates;
        this.div = arg.div;
        this.sourceItems = arg.items;
    }

    calShareOfYears() {
        this.shareOfYear = this.days.map((day) => day / 360.0);
    }

    calStrikePrices() {
        this.strikePrices = this.strikes.map((strike) => this.spot * strike);
    }

    fillStep1() {
        const strikesAboveOne = this.strikes.filter((p) => p < 1).length;
        const newTermsLen = 4;
        const invByStrike = getInvMatrix(strikesAboveOne, this.strikes);

        // Заполняем строки с добавленными страйковыми ступеньками 60% и 70%
        const vecForStrikes = new Array(strikesAboveOne);
        const newRows = new Array(2);
        const newStrikes = [0.6, 0.7];
        for (let r = 0; r < newRows.length; r++) {
            newRows[r] = new Array(this.sourceItems[0].length);
            for (let c = 0; c < newRows[r].length; c++) {
                for (let i = 0; i < strikesAboveOne; i++) {
                    vecForStrikes[i] = this.sourceItems[i][c];
                }
                const coefRes = matrixMultiply(invByStrike, vecForStrikes);
                newRows[r][c] = extrapolationByStrike(
                    newStrikes[r],
                    coefRes,
                    strikesAboveOne
                );
            }
        }

        this.strikes = [0.6, 0.7, ...this.strikes];
        this.days = [Math.ceil(this.days[0] / 2), ...this.days];
        const items = [...newRows, ...this.sourceItems];

        // Добавляем новый срок
        this.calShareOfYears();
        const invByTerm = getInvMatrix(newTermsLen, this.shareOfYear.slice(1));
        const vecForTerms = new Array(newTermsLen);
        for (let r = 0; r < items.length; r++) {
            for (let c = 0; c < newTermsLen; c++) {
                vecForTerms[c] = items[r][c];
            }
            const coefRes = matrixMultiply(invByTerm, vecForTerms);

            const val = extrapolationByStrike(
                this.shareOfYear[0],
                coefRes,
                newTermsLen
            );
            items[r] = [val, ...items[r]];
        }
        this.step1 = items;
    }

    fillStep2() {
        this.fillStep1();
        this.calStrikePrices();
        this.step2 = this.step1.map((step1Row, r) => {
            const log = Math.log(this.spot / this.strikePrices[r]);
            return step1Row.map((step1Val, c) => {
                const C4 = this.riskFreeRates[c];
                const C5 = this.div[c];
                const C35 = this.shareOfYear[c];
                return (
                    (log + (C4 - C5 + Math.pow(step1Val, 2) / 2) * C35) /
                    (step1Val * Math.sqrt(C35))
                );
            });
        });
    }

    fillStep3() {
        this.fillStep2();
        this.step3 = this.step1.map((step1Row, r) => {
            return step1Row.map((step1Val, c) => {
                if (c === 0) return 0;
                return (
                    (step1Val - step1Row[c - 1]) /
                    (this.shareOfYear[c] - this.shareOfYear[c - 1])
                );
            });
        });
    }

    fillStep4() {
        this.fillStep3();
        this.step4 = this.step1.map((step1Row, r) => {
            if (r === 0) return new Array(step1Row.length).fill(0);
            return step1Row.map((step1Val, c) => {
                return (
                    (step1Val - this.step1[r - 1][c]) /
                    (this.strikePrices[r] - this.strikePrices[r - 1])
                );
            });
        });
    }

    fillStep5() {
        this.fillStep4();
        this.step5 = this.step1.map((step1Row, r) => {
            if (r <= 1) return new Array(step1Row.length).fill(0);
            return step1Row.map((step1Val, c) => {
                return (
                    (step1Val -
                        2 * this.step1[r - 1][c] +
                        this.step1[r - 2][c]) /
                    Math.pow(this.strikePrices[r] - this.strikePrices[r - 2], 2)
                );
            });
        });
    }

    fillStep6() {
        this.fillStep5();
        this.step6 = this.step1.map((step1Row, r) => {
            if (r <= 1) return new Array(step1Row.length).fill(0);
            return step1Row.map((step1Val, c) => {
                if (c === 0) return 0;
                const D53 = this.step3[r][c];
                const D68 = this.step4[r][c];
                return (
                    step1Val * step1Val +
                    2 *
                        step1Val *
                        this.shareOfYear[c] *
                        (D53 +
                            (this.riskFreeRates[c] - this.div[c]) *
                                this.strikePrices[r] *
                                D68)
                );
            });
        });
    }

    fillStep7() {
        this.fillStep6();
        this.step7 = this.step1.map((step1Row, r) => {
            if (r <= 1) return new Array(step1Row.length).fill(0);
            return step1Row.map((step1Val, c) => {
                if (c === 0) return 0;
                const B118 = this.strikePrices[r];
                const D38 = this.step2[r][c];
                const D68 = this.step4[r][c];
                const D115 = this.shareOfYear[c];
                const D12 = step1Val;
                const D84 = this.step5[r][c];
                return (
                    Math.pow(1 + B118 * D38 * D68 * Math.sqrt(D115), 2) +
                    D12 *
                        Math.pow(B118, 2) *
                        D115 *
                        (D84 - D38 * Math.pow(D68, 2) * Math.sqrt(D115))
                );
            });
        });
    }

    fillStep8() {
        this.fillStep7();
        this.step8 = this.step1.map((step1Row, r) => {
            if (r <= 1) return new Array(step1Row.length).fill(0);
            return step1Row.map((step1Val, c) => {
                if (c === 0) return 0;
                const D101 = this.step6[r][c];
                const D118 = this.step7[r][c];
                return Math.sqrt(D101 / D118);
            });
        });
    }
    getResult() {
        this.fillStep8();
        return this.step8.slice(2).map((el) => el.slice(1));
    }
}
