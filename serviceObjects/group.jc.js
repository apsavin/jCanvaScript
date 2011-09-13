jCanvaScript.Proto.Group = function(elements) {
    for (var Class in jCanvaScript.Proto)if (jCanvaScript.Proto.hasOwnProperty(Class)){
        if (Class == 'Group')continue;
        var tmp = jCanvaScript.Proto[Class].prototype;
        for (var key in tmp) if(tmp.hasOwnProperty(key)){
            if (typeof tmp[key] == 'function' && this.prototype[key] === undefined) {
                (function(group, key) {
                    group.prototype[key] = function() {
                        var argumentsClone = [];
                        var args = [];
                        var i = 0;
                        while (arguments[i] !== undefined)
                            args[i] = arguments[i++];
                        for (i = 0; i < this.elements.length; i++) {
                            var element = this.elements[i];
                            jCanvaScript.take(argumentsClone, args);
                            if (typeof element[key] == 'function') {
                                element[key].apply(element, argumentsClone);
                            }
                        }
                        return this;
                    }
                })(this, key);
            }
        }
    }
    this.elements = elements || [];
    this.unmatchedElements = [];
    this._proto='Group';
};
jCanvaScript.Proto.Group.prototype.reverse = function() {
    var tmpArray = this.elements;
    this.elements = this.unmatchedElements;
    this.unmatchedElements = tmpArray;
    return this;
};
jCanvaScript.Proto.Group.prototype.end = function(n) {
    if (this.previousGroup === undefined || n === 0)return this;
    if (n !== undefined)n--;
    return this.previousGroup.end(n);
};
jCanvaScript.Proto.Group.prototype.find = function(map) {
    var subgroup = group(),
        attrs = map.attrs,
        fns = map.fns || [],
        i,j,
        element,rel,fn,value1,value2;
    subgroup.previousGroup = this;
    for (i = 0; i < this.elements.length; i++) {
        subgroup.elements[i] = this.elements[i];
    }
    if (attrs !== undefined) {
        for (j in attrs) {
            if (attrs.hasOwnProperty(j)) {
                if (typeof attrs[j] != 'object') {
                    attrs[j] = {val:attrs[j],rel:'=='};
                }
                fns[fns.length] = {
                    fn:'attr',
                    args:[j],
                    val:attrs[j].val,
                    rel:attrs[j].rel
                };
            }
        }
    }
    if (fns.length) {
        for (i = 0; i < subgroup.elements.length; i++) {
            element = subgroup.elements[i];
            for (j = 0; j < fns.length; j++) {
                fn = fns[j];
                value2 = fn.val;
                rel = fn.rel;
                if (typeof element[fn.fn] == 'function')
                    value1 = element[fn.fn].apply(element, fn.args);
                else rel = 'del';
                switch (rel) {
                    case '!=':
                        if (!(value1 != value2))rel = 'del';
                        break;
                    case '!==':
                        if (!(value1 !== value2))rel = 'del';
                        break;
                    case '==':
                        if (!(value1 == value2))rel = 'del';
                        break;
                    case '===':
                        if (!(value1 === value2))rel = 'del';
                        break;
                    case '>=':
                        if (!(value1 >= value2))rel = 'del';
                        break;
                    case '<=':
                        if (!(value1 <= value2))rel = 'del';
                        break;
                    case '>':
                        if (!(value1 > value2))rel = 'del';
                        break;
                    case '<':
                        if (!(value1 < value2))rel = 'del';
                        break;
                    case 'typeof':
                        if (!(typeof value1 == value2))rel = 'del';
                        break;
                }
                if (rel == 'del') {
                    subgroup.unmatchedElements[subgroup.unmatchedElements.length] = element;
                    subgroup.elements.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
    return subgroup;
};
jCanvaScript.group = function(elements)
{
	return new jCanvaScript.Proto.Group(elements);
}