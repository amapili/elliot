import { List } from 'immutable'

export default class Route {
    readonly items: List<string | number>
    readonly item: string | number
    readonly index: number

    constructor(items: List<string | number> | Array<number | string>, index: number = 0) {
        this.items = Array.isArray(items) ? List(items) : items
        this.item = this.items.get(index, '')
        this.index = index
    }

    static from(url: string) {
        return new Route(List(url.split('/').map(i => {
            const str = decodeURIComponent(i),
                num = parseInt(str)
            if (!isNaN(num) && str === '' + num)
                return num
            return str
        }).filter(s => s !== '')), 0)
    }

    toString() {
        return '/' + this.items.filter(s => s !== '').map(s => encodeURIComponent(s)).join('/')
    }

    equals(o: unknown) {
        if (o === this) return true
        if (!(o instanceof Route)) return false
        return this.toString() === o.toString()
    }

    clear() {
        return new Route(this.items.slice(0, this.index), this.index)
    }

    next() {
        return new Route(this.items, this.index + 1)
    }

    match<T>(map: { [k: string]: (route: Route) => T }, num?: (n: number, route: Route) => T) {
        const item = this.items.get(this.index, '')
        if (typeof item === 'number')
            return num ? num(item, this.next()) : null
        const fn = map[item]
        if (!fn) return null
        return fn(this.next())
    }

    onNumber<T>(fn: (n: number, r: Route) => T) {
        const item = this.items.get(this.index)
        if (typeof item === 'number')
            return fn(item, this.next())
        return null
    }

    add(...items: Array<string | number>) {
        return new Route(this.items.concat(items), this.index + 1)
    }

    replace(...args: Array<string | number>) {
        return new Route(this.items.slice(0, this.index).concat(args), this.index)
    }

    replaceRest(...args: Array<string | number>) {
        return new Route(this.items.slice(0, this.index + 1).concat(args), this.index)
    }
}