export type Language = "en" | "vi"

export const translations = {
  en: {
    // Navigation
    productCatalog: "Product Catalog",
    cart: "Cart",
    checkout: "Checkout",
    refresh: "Refresh",
    tryAgain: "Try Again",
    // Product Table
    id: "ID",
    productName: "Product Name",
    description: "Description",
    price: "Price",
    priceOfBatch: "Batch Price",
    batchPricing: "Batch Pricing",
    useBatchPrice: "Use Batch Price",
    useRegularPrice: "Use Regular Price",
    stock: "Stock",
    action: "Action",
    searchProducts: "Search products...",
    noProductsFound: "No products found.",
    inStock: "In Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    addToCart: "Add to Cart",

    // Cart
    viewCart: "View Cart",
    yourCart: "Your Cart",
    items: "items",
    emptyCart: "Your cart is empty",
    addProductsBeforeCheckout: "Add some products to your cart before checking out.",
    backToProducts: "Back to Products",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",

    // Checkout
    shippingInformation: "Shipping Information",
    orderSummary: "Order Summary",
    fullName: "Full Name",
    email: "Email",
    phoneNumber: "Phone Number",
    address: "Address",
    city: "City",
    zipCode: "Zip Code",
    completeOrder: "Complete Order",
    processing: "Processing...",

    // Invoice
    invoice: "INVOICE",
    billTo: "Bill To:",
    invoiceDetails: "Invoice Details:",
    date: "Date:",
    paymentMethod: "Payment Method:",
    status: "Status:",
    paid: "Paid",
    item: "Item",
    quantity: "Quantity",
    creditCard: "Credit Card",
    printInvoice: "Print Invoice",
    finishShopping: "Finish Shopping",
    thankYou: "Thank you for your purchase!",
    contactSupport: "If you have any questions, please contact our customer support.",

    // Store Info
    storeName: "E-Commerce Store",
    storeAddress: "123 Commerce St",
    storeCity: "New York, NY 10001",
    storeEmail: "support@ecommerce.com",

    // Errors
    loadingError: "Error loading products. Please try again.",
    loading: "Loading products...",

    // Cache
    dataFromCache: "Using Cached Data",
    usingCachedProductData: "Products loaded from local cache",
    usingCachedData: "Using cached data. Click refresh to update.",

    // Cache clearing
    clearCache: "Clear Cache",
    cacheCleared: "Cache Cleared",
    productCacheCleared: "Product cache has been cleared",

    // Cache expiry
    expires: "expires in",
  },
  vi: {
    // Navigation
    productCatalog: "Danh Mục Sản Phẩm",
    cart: "Giỏ Hàng",
    checkout: "Thanh Toán",
    refresh: "Làm Mới",
    tryAgain: "Thử Lại",
    // Product Table
    id: "Mã",
    productName: "Tên Sản Phẩm",
    description: "Mô Tả",
    price: "Giá",
    priceOfBatch: "Giá Sỉ",
    batchPricing: "Giá Sỉ",
    useBatchPrice: "Sử Dụng Giá Sỉ",
    useRegularPrice: "Sử Dụng Giá Thường",
    stock: "Tồn Kho",
    action: "Thao Tác",
    searchProducts: "Tìm kiếm sản phẩm...",
    noProductsFound: "Không tìm thấy sản phẩm nào.",
    inStock: "Còn Hàng",
    lowStock: "Sắp Hết",
    outOfStock: "Hết Hàng",
    addToCart: "Thêm Vào Giỏ",

    // Cart
    viewCart: "Xem Giỏ Hàng",
    yourCart: "Giỏ Hàng Của Bạn",
    items: "sản phẩm",
    emptyCart: "Giỏ hàng của bạn đang trống",
    addProductsBeforeCheckout: "Thêm một số sản phẩm vào giỏ hàng trước khi thanh toán.",
    backToProducts: "Quay Lại Sản Phẩm",
    continueShopping: "Tiếp Tục Mua Sắm",
    subtotal: "Tạm Tính",
    tax: "Thuế",
    total: "Tổng Cộng",

    // Checkout
    shippingInformation: "Thông Tin Giao Hàng",
    orderSummary: "Tóm Tắt Đơn Hàng",
    fullName: "Họ Tên",
    email: "Email",
    phoneNumber: "Số Điện Thoại",
    address: "Địa Chỉ",
    city: "Thành Phố",
    zipCode: "Mã Bưu Điện",
    completeOrder: "Hoàn Tất Đơn Hàng",
    processing: "Đang Xử Lý...",

    // Invoice
    invoice: "HÓA ĐƠN",
    billTo: "Người Nhận:",
    invoiceDetails: "Chi Tiết Hóa Đơn:",
    date: "Ngày:",
    paymentMethod: "Phương Thức Thanh Toán:",
    status: "Trạng Thái:",
    paid: "Đã Thanh Toán",
    item: "Sản Phẩm",
    quantity: "Số Lượng",
    creditCard: "Thẻ Tín Dụng",
    printInvoice: "In Hóa Đơn",
    finishShopping: "Hoàn Tất Mua Sắm",
    thankYou: "Cảm ơn bạn đã mua hàng!",
    contactSupport: "Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng của chúng tôi.",

    // Store Info
    storeName: "Cửa Hàng Thương Mại Điện Tử",
    storeAddress: "123 Đường Thương Mại",
    storeCity: "Hà Nội, Việt Nam",
    storeEmail: "hotro@ecommerce.com",

    // Errors
    loadingError: "Lỗi khi tải sản phẩm. Vui lòng thử lại.",
    loading: "Đang tải sản phẩm...",

    // Cache
    dataFromCache: "Sử dụng dữ liệu đã lưu",
    usingCachedProductData: "Sản phẩm được tải từ bộ nhớ đệm",
    usingCachedData: "Đang sử dụng dữ liệu đã lưu. Nhấn làm mới để cập nhật.",

    // Cache clearing
    clearCache: "Xóa bộ nhớ đệm",
    cacheCleared: "Đã xóa bộ nhớ đệm",
    productCacheCleared: "Bộ nhớ đệm sản phẩm đã được xóa",

    // Cache expiry
    expires: "hết hạn sau",
  },
}

export type TranslationKey = keyof typeof translations.en
