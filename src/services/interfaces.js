/**
 * Abstract Interface for Authentication Service
 * Any auth provider (Firebase, Auth0, AWS Cognito) must implement these methods.
 */
export class IAuthService {
    async login(email, password) { throw new Error("Method not implemented"); }
    async register(email, password, name) { throw new Error("Method not implemented"); }
    async logout() { throw new Error("Method not implemented"); }
    async resetPassword(email) { throw new Error("Method not implemented"); }
    async updateProfile(userId, data) { throw new Error("Method not implemented"); }
    onAuthStateChanged(callback) { throw new Error("Method not implemented"); }
}

/**
 * Abstract Interface for Order Service
 * Any database (Firestore, MongoDB, SQL) must implement these methods.
 */
export class IOrderService {
    async createOrder(orderData, userId) { throw new Error("Method not implemented"); }
    async getOrderById(orderId) { throw new Error("Method not implemented"); }
    async getUserOrders(userId) { throw new Error("Method not implemented"); }
    async getAllOrders() { throw new Error("Method not implemented"); } // Admin
    async updateOrderStatus(orderId, status) { throw new Error("Method not implemented"); }
    subscribeToOrders(callback) { throw new Error("Method not implemented"); } // Real-time
}

/**
 * Abstract Interface for Product Service
 */
export class IProductService {
    async getAllProducts() { throw new Error("Method not implemented"); }
    async getProductById(productId) { throw new Error("Method not implemented"); }
    async addProduct(productData) { throw new Error("Method not implemented"); }
    async updateProduct(productId, productData) { throw new Error("Method not implemented"); }
    async deleteProduct(productId) { throw new Error("Method not implemented"); }
    subscribeToProducts(callback) { throw new Error("Method not implemented"); }
}

export class IContentService {
    async getPageContent(pageId) { throw new Error("Method not implemented"); }
    async updatePageContent(pageId, content) { throw new Error("Method not implemented"); }
}
