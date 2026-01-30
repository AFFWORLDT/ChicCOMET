"use client"

export type LanguageCode = "en" | "ar"

export const dictionaries: Record<LanguageCode, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.collections": "Collections",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.premium": "Premium Collections",
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "footer.quickLinks": "Quick Links",
    "footer.customerCare": "Customer Care",
    "footer.contactUs": "Contact Us",
    "lang.english": "English",
    "lang.arabic": "Arabic",
    "lang.switchLabel": "Language",
    // Admin
    "admin.panel": "Admin Panel",
    "admin.viewSite": "View Site",
    "admin.dashboard": "Dashboard",
    "admin.products": "Products",
    "admin.categories": "Categories",
    "admin.orders": "Orders",
    "admin.users": "Users",
    "admin.recentOrders": "Recent Orders",
    "admin.topProducts": "Top Products",
    "admin.totalProducts": "Total Products",
    "admin.totalOrders": "Total Orders",
    "admin.totalUsers": "Total Users",
    "admin.totalRevenue": "Total Revenue",
    "admin.refresh": "Refresh",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.products": "المنتجات",
    "nav.collections": "المجموعات",
    "nav.about": "من نحن",
    "nav.contact": "تواصل معنا",
    "nav.premium": "مجموعات فاخرة",
    "auth.signin": "تسجيل الدخول",
    "auth.signup": "إنشاء حساب",
    "footer.quickLinks": "روابط سريعة",
    "footer.customerCare": "خدمة العملاء",
    "footer.contactUs": "اتصل بنا",
    "lang.english": "الإنجليزية",
    "lang.arabic": "العربية",
    "lang.switchLabel": "اللغة",
    // Admin
    "admin.panel": "لوحة التحكم",
    "admin.viewSite": "عرض الموقع",
    "admin.dashboard": "لوحة القيادة",
    "admin.products": "المنتجات",
    "admin.categories": "الفئات",
    "admin.orders": "الطلبات",
    "admin.users": "المستخدمون",
    "admin.recentOrders": "أحدث الطلبات",
    "admin.topProducts": "أفضل المنتجات",
    "admin.totalProducts": "إجمالي المنتجات",
    "admin.totalOrders": "إجمالي الطلبات",
    "admin.totalUsers": "إجمالي المستخدمين",
    "admin.totalRevenue": "إجمالي الإيرادات",
    "admin.refresh": "تحديث",
  },
}

export function isRTL(lang: LanguageCode) {
  return lang === "ar"
}


