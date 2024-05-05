export const calcFactorial=(num:number)=>  {
    const n = (num);
    if (!isNaN(n) && n >= 0) {
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
       return result;
    }
}

