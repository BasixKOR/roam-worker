export function translatePath(path: string): string {
	switch(true) {
		case path.startsWith('/p/assets'):
			return path.slice(2);
		case path.endsWith('.js') && path.startsWith('/p/'):
			return path.slice(2);
		case path.startsWith('/p/'):
			return `/#/app/Basix/page/${path.slice(3)}`;
		case path === '/':
			return `/#/app/Basix/page/83vDxwXZk`;
		default:
			return path;
	}
}