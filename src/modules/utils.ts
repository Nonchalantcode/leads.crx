class DOM{
    static f<T extends HTMLElement>(sel: string, context: (Document | T) = document): null | T{
        return context.querySelector(sel);
    };

    static fall<T extends HTMLElement>(sel: string, context: (Document | Element) = document): NodeListOf<T>{
        return context.querySelectorAll(sel);
    }
    static create<T extends HTMLElement>(domString: string){
        let __temporal = document.createElement("div") as Element;
        __temporal.innerHTML = domString;
        return __temporal.children.length == 1 ? 
                __temporal.children[0].cloneNode(true) as T : 
                (_ => {
                    let elements: T[] = []
                    for(let i = 0; i < __temporal.children.length; i++){
                        elements.push(__temporal.children[i].cloneNode(true) as T);
                    }
                    return elements;
                })()
    }
    
    static setAttr<T extends HTMLElement>(el: T, attr: string, val: string){
        el.setAttribute(attr, val);
        return el;
    }
    static getAttr(el: HTMLElement, attr: string){
        return el.getAttribute(attr);
    }
    static style<T extends HTMLElement>(el: T, cssRules: {[cssProp: string]: string | number}){
        let styles = [];
        for(let rule in cssRules){
            styles.push(`${rule}: ${cssRules[rule]};`);
        }
        return DOM.setAttr(el, 'style', styles.join(''));
    }
    static append<T extends HTMLElement>(child: T, parent: T){
        return parent.appendChild(child);
    }
    static remove<T extends HTMLElement>(child: T, parent: T){
        return parent.removeChild(child);
    }
}

class Utils{
    static doTimes(n: number, fn: Function){
        if(n <= 0) return;
        for(let i: number = 0; i < n; i++){
            fn(i);
        }
    }
    static thread(v: any, ...fns: any[][]): any{
        return fns.reduce((acc, curr) => {
            let [fn, ...args] = curr;
            acc = fn(acc, ...args);
            return acc;
        }, v);
    }
    static once(fn: Function): Function{
        let called = false,
          __ret: any;
        return (...args: any[]) => {
          if (called) {
            return __ret;
          }
          called = !called;
          __ret = fn(...args);
          return __ret;
        }
    }
    static noOp(){}
    static partition<T>(coll: T[], n: number): T[][]{
        let result: T[][] = [];
        let partialResults: T[] = [];
        if (n <= 0 || coll.length == 0) {
          return result;
        }
        if (n >= coll.length) {
          return [coll];
        }
        for (
          let iterTimes = Math.ceil(coll.length / n),
          currIndex = 0,
          i = 0;
          i < iterTimes;
          i++
        ){
          for (let j = 0; j < n && currIndex < coll.length; j++){
            partialResults.push(coll[currIndex++]);
          }
          result.push(partialResults);
          partialResults = [];
        }
        return result;
    }
}


export {DOM as dom, Utils as u};