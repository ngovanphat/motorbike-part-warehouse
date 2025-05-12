// store.js
import { createStore } from 'vuex';
import { saveInvoice } from './services/googleSheetsService';

export default createStore({
  state: {
    products: [],
    cart: [],
    invoices: [],
    notifications: []
  },
  
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    
    setInvoices(state, invoices) {
      state.invoices = invoices;
    },
    
    addToCart(state, product) {
      const existingItem = state.cart.find(item => item.productId === product.productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({
          ...product,
          quantity: 1,
          isSelected: true
        });
      }
    },
    
    updateCartItemQuantity(state, { productId, quantity }) {
      const item = state.cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    toggleCartItemSelection(state, productId) {
      const item = state.cart.find(item => item.productId === productId);
      if (item) {
        item.isSelected = !item.isSelected;
      }
    },
    
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item.productId !== productId);
    },
    
    clearCart(state) {
      state.cart = [];
    },
    
    addInvoice(state, invoice) {
      state.invoices.push(invoice);
    },
    
    addNotification(state, notification) {
      state.notifications.push({
        id: Date.now(),
        ...notification
      });
    },
    
    removeNotification(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id);
    }
  },
  
  actions: {
    async createInvoice({ commit, state }) {
      const selectedItems = state.cart.filter(item => item.isSelected);
      
      if (selectedItems.length === 0) {
        commit('addNotification', {
          type: 'error',
          message: 'Không có sản phẩm nào được chọn'
        });
        return null;
      }
      
      const totalPrice = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      const invoice = {
        invoiceId: `INV${Date.now()}`,
        items: selectedItems,
        totalPrice,
        date: new Date().toISOString()
      };
      
      try {
        const success = await saveInvoice(invoice);
        
        if (success) {
          commit('addInvoice', invoice);
          commit('clearCart');
          commit('addNotification', {
            type: 'success',
            message: 'Lưu hóa đơn thành công'
          });
          return invoice;
        } else {
          commit('addNotification', {
            type: 'error',
            message: 'Lỗi khi lưu hóa đơn'
          });
          return null;
        }
      } catch (error) {
        console.error('Error creating invoice:', error);
        commit('addNotification', {
          type: 'error',
          message: 'Lỗi khi lưu hóa đơn'
        });
        return null;
      }
    }
  },
  
  getters: {
    cartTotal(state) {
      return state.cart
        .filter(item => item.isSelected)
        .reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    cartItemCount(state) {
      return state.cart
        .filter(item => item.isSelected)
        .reduce((count, item) => count + item.quantity, 0);
    }
  }
});
