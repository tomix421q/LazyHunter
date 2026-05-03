class OpenListManager {
	activeId = $state<number | null>(null);

	toggle(id: number) {
		if (this.activeId === id) {
			this.activeId = null;
		} else {
			this.activeId = id;
		}
	}

	closeAll() {
		this.activeId = null;
	}
}

class ProductsListsStore {
	items = $state<any['items']>([]);
	isLoading = $state(false);

	totalCount = $derived(this.items.length);

	setItems(newItems: any['items']) {
		this.items = newItems;
	}

	addItems(newItems: any['items']) {
		this.items = [...this.items, ...newItems];
	}
}

class UserProfileStore {
	user = $state<any | null>(null);

	setUser(userUpdate: any | null | undefined) {
		if (userUpdate === undefined) {
			this.user = null;
		} else {
			this.user = userUpdate;
		}
	}
}

export const menuManager = new OpenListManager();
export const listProductStore = new ProductsListsStore();
export const userProfileStore = new UserProfileStore();
