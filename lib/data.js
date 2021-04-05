/* jshint node: true, esversion: 6 */
/* jshint -W054 */
'use strict';

/**
 * Symbol to mark that a function has been generated via <texttt>$</texttt>.
 * @private
 * @const {symbol}
 * @readonly
 **/
const $rhs = Symbol();

/**
 * Temporary buffer in which to store the constructor specifications
 * of a structured type.
 * @private
 **/
let specs = [];

/**
 * Defines a structured type.
 * @param {string} name - the name of the structured type.
 * @returns a structured type.
 **/
function data(name) {
    if (!name) {
        throw new Error('A structured type must have a name');
    }

    const variants = [];
    specs = [];

    const {[name]: Base} = {
        [name]: class {
            constructor() {
                if (new.target === Base) {
                    throw new TypeError(`${name} cannot be instantiated`);
                }
            }

            static set $(ok) {
                if (variants.length > 0) {
                    throw new Error('Constructors cannot be re-defined');
                }
                if (!specs.length && !ok[$rhs]) {
                    throw new Error('Right-hand side should be generated via $');
                }
                if (!specs.length) {
                    ok[Symbol.toPrimitive]();
                }
                for (let {name, params} of specs) {
                    Base[name] = constructor(Base, name, params);
                    variants.push(Base[name]);
                }
                specs = [];
            }
        }
    };

    return Base;
}

/**
 * Syntax element for specifying the constructors of a structured type.
 * @readonly
 * @const
 **/
const $ = new Proxy({}, {

    get(target, name) {

        function variant(...params) {
            specs.push({name, params});
        }

        const proto = Object.create(Function.prototype);
        Reflect.setPrototypeOf(variant, proto);

        proto[Symbol.toPrimitive] = function () {
            specs.push({name, params: []});
            return 0;
        };

        proto[$rhs] = true;

        return variant;
    }
});

/**
 * Returns a constructor function of a structured type.
 * @private
 * @param {Class} Base - the base class that encodes the structured type.
 * @param {string} name - the name of the constructor function.
 * @param {Array.<string>} params - the parameter names of the constructor function.
 * @returns {Function} the constructor function.
 **/
function constructor(Base, name, params) {
    const make = new Function('Base',
        `return function ${name}(${params.join(',')}) {
            const self = Reflect.construct(Base, [${params.join(',')}], ${name})
            ${params.map(param => `self.${param} = ${param};`).join(' ')}
            return self;
        }`);

    const Cn = make(Base);

    Cn.prototype[Symbol.iterator] = function* () {
        for (const param of params) {
            yield this[param];
        }
    };

    Reflect.setPrototypeOf(Cn.prototype, Base.prototype);
    Reflect.setPrototypeOf(Cn, Base);

    return Cn;
}

module.exports = {
    data,
    $
};
