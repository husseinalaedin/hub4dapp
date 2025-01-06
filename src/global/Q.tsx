export class Q {
    static GroupBy = (data, bys, sums, concats?) => {
        let groups = data.reduce((accumulator, datum) => {

            let key = ''
            for (let i = 0; i < bys.length; i++) {
                key = key + datum[bys[i]]
            }
            if(key=='')
                key ='ANY'
            if (!accumulator[key]) {
                accumulator[key] = {};

                for (let i = 0; i < bys.length; i++) {
                    accumulator[key][bys[i]] = datum[bys[i]];
                }
                for (let i = 0; i < sums.length; i++) {
                    accumulator[key][sums[i]] = 0;
                }
                if (concats)
                    for (let as in concats) {
                        let ases = concats[as];
                        accumulator[key][as]=''
                        for(let i=0;i<ases.length;i++){
                            let exist=false;
                            for (let k in datum) {
                                if(k==ases[i]){
                                    exist=true;
                                    break;
                                }
                            }
                            if (exist)
                                 accumulator[key][as] = accumulator[key][as]+''+datum[ases[i]];
                            else   
                                accumulator[key][as] = accumulator[key][as] + '' + ases[i];     
                        }
                    }
            }
            for (let i = 0; i < sums.length; i++) {
                accumulator[key][sums[i]] += +datum[sums[i]];
            }
            return accumulator;
        }, {});

        let result = Object.values(groups);
        console.log(result);
        return result
    }
}
