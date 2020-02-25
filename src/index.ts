import {IReturnOn, THandlerOn} from './types';

export class AzStore {
    store:  Map<string, any>;
    events: {
        [key: string]: THandlerOn[];
    };

	constructor(state?: Array<[string, any]>) {
		this.store = new Map(state);
		this.events = {};
    }
    
	set<T>(name: string, value: T) {
		this.store.set(name, value);
		this.emit(name, value);
    }

	get<T>(name: string, def: T) {
		if (this.store.has(name)) {
			return this.store.get(name);
		} else {
			this.store.set(name, def);
			return def;
		}
    }
    

	push<T>(name: string, data: T) {
		const state: any[] = this.store.has(name) ? this.store.get(name) : [];
		state.push(data);
		this.store.set(name, state);
		this.emit(name, state);
	}

	on(event: string, fn: THandlerOn): IReturnOn {
		this.events[event] =
            this.events[event] === undefined ? [] : this.events[event];
        
		// добавляем listener в очередь
		const index = this.events[event].push(fn) - 1;
		return {
			remove: () => {
				delete this.events[event][index];
			}
		};
    }
    
	off(event: string, fn: THandlerOn): void {
		if (this.events[event]) {
			for (let i = 0; i < this.events[event].length; i++) {
				if (this.events[event][i] === fn) {
					this.events[event].splice(i, 1);
					break;
				}
			}
		}
    }
    
	emit<T>(event: string, data: T): void {
		if (this.events[event]) {
			this.events[event].forEach(function(fn) {
				fn(data === undefined ? {} : data);
			});
		}
    }

	subscribe(event: string, fn: THandlerOn): IReturnOn {
		return this.on(event, fn);
    }

	unsubscribe(event: string, fn: THandlerOn) {
		return this.off(event, fn);
    }

	publish<T>(event: string, data: T) {
		return this.emit(event, data);
	}

}
