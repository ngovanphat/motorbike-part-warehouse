export type Language = "en" | "vi"

export const translations = {
  en: {
    dashboard: "Dashboard",
    products: "Products",
    invoices: "Invoices",

    // Dashboard
    dailySales: "Daily Sales",
    totalSalesPerDay: "Total sales amount per day",
    productSummary: "Summary of quantities sold per product",

    // Invoice
    invoiceNumber: "Invoice Number",
    date: "Date",
    customer: "Customer",
    total: "Total",
    actions: "Actions",
    viewInvoice: "View Invoice",
    noInvoicesFound: "No invoices found",
    noInvoicesYet: "No invoices yet",
    searchInvoices: "Search invoices...",
    close: "Close",
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
    unit: "Unit",

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
    bankDetails: "Bank Details",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    accountOwner: "Account Owner",

    // Invoice
    invoice: "INVOICE",
    billTo: "Bill To:",
    invoiceDetails: "Invoice Details:",
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
    discount: "Discount",
    discountTooHigh: "Discount Too High",
    discountCannotExceedSubtotal: "Discount Cannot Exceed Subtotal",
    invalidDiscount: "Invalid Discount",
    pleaseEnterValidDiscount: "Please Enter Valid Discount",
    apply: "Apply",
    clearDiscount: "Clear Discount",
    applyDiscount: "Apply Discount",
    customDiscountPlaceholder: "Enter custom discount",
    // Store Info
    storeName: "Thông phụ tùng xe máy",
    storeAddress: "9-11 Phan Bội Châu",
    storeCity: "Hồng Ngự, Đồng Tháp, Việt Nam",
    storePhone: "0918716971",

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
    dashboard: "Bảng Điều Khiển",
    products: "Sản Phẩm",
    invoices: "Hóa Đơn",

    // Dashboard
    dailySales: "Doanh Thu Ngày",
    totalSalesPerDay: "Tổng doanh thu ngày",
    productSummary: "Tổng số lượng sản phẩm bán ra",

    // Invoice
    invoiceNumber: "Số Hóa Đơn",
    date: "Ngày",
    customer: "Khách Hàng",
    total: "Tổng Cộng",
    actions: "Hành Động",
    viewInvoice: "Xem Hóa Đơn",
    noInvoicesFound: "Không tìm thấy hóa đơn nào",
    noInvoicesYet: "Không có hóa đơn nào",
    searchInvoices: "Tìm kiếm hóa đơn...",
    close: "Đóng",

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
    discount: "Giảm Giá",
    discountTooHigh: "Giảm Giá Quá Cao",
    discountCannotExceedSubtotal: "Giảm Giá Không Được Vượt Quá Tổng Tiền",
    invalidDiscount: "Giảm Giá Không Hợp Lệ",
    pleaseEnterValidDiscount: "Vui Lòng Nhập Giảm Giá Hợp Lệ",
    apply: "Áp Dụng",
    clearDiscount: "Xóa Giảm Giá",
    customDiscountPlaceholder: "Nhập giảm giá tùy chỉnh",
    applyDiscount: "Áp Dụng Giảm Giá",
    recommendedDiscounts: "Giảm Giá Khuyến Nghị",
    bankDetails: "Thông Tin Ngân Hàng",
    bankName: "Tên Ngân Hàng",
    accountNumber: "Số Tài Khoản",
    accountOwner: "Chủ Tài Khoản",

    // Invoice
    invoice: "HÓA ĐƠN",
    billTo: "Người Nhận:",
    invoiceDetails: "Chi Tiết Hóa Đơn:",
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
    storeName: "Cửa hàng Thông phụ tùng xe máy",
    storeAddress: "9-11 Phan Bội Châu",
    storeCity: "Hồng Ngự, Đồng Tháp, Việt Nam",
    storePhone: "0918716971",

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
    unit: "Đơn Vị",
  },
}

export type TranslationKey = keyof typeof translations.en
