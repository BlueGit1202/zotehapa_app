import { combineReducers } from "redux";
// Import all your reducers
import { authReducer } from "./reducers/auth";
import { companyReducer } from "./reducers/company";
import { countryCodeReducer } from "./reducers/countryCode";
import { mailReducer } from "./reducers/mail";
import { otpReducer } from "./reducers/otp";
import { notificationReducer } from "./reducers/notification";
import { socialMediaReducer } from "./reducers/socialMedia";
import { licenseReducer } from "./reducers/license";
import { cookiesReducer } from "./reducers/cookies";
import { pageReducer } from "./reducers/page";
import { analyticReducer } from "./reducers/analytic";
import { themeReducer } from "./reducers/theme";
import { sliderReducer } from "./reducers/slider";
import { currencyReducer } from "./reducers/currency";
import { siteReducer } from "./reducers/site";
import { productCategoryReducer } from "./reducers/productCategory";
import { productAttributeReducer } from "./reducers/productAttribute";
import { taxReducer } from "./reducers/tax";
import { menuSectionReducer } from "./reducers/menuSection";
import { menuTemplateReducer } from "./reducers/menuTemplate";
import { languageReducer } from "./reducers/language";
import smsGatewayReducer from "./reducers/smsGateway";
import { paymentGatewayReducer } from "./reducers/paymentGateway";
import { timezoneReducer } from "./reducers/timezone";
import { productAttributeOptionReducer } from "./reducers/productAttributeOption";
import { productReducer } from "./reducers/product";
import frontendSettingReducer from "./reducers/frontend/frontendSetting";
import frontendLanguageReducer from "./reducers/frontend/frontendLanguage";
import { globalReducer } from "./reducers/frontend/globalState";
import frontendEditProfileReducer from "./reducers/frontend/frontendEditProfile";
import { roleReducer } from "./reducers/role";
import { permissionReducer } from "./reducers/permission";
import { administratorReducer } from "./reducers/administrator";
import { administratorAddressReducer } from "./reducers/administratorAddress";
import { customerReducer } from "./reducers/customer";
import { customerAddressReducer } from "./reducers/customerAddress";
import { employeeReducer } from "./reducers/employee";
import { employeeAddressReducer } from "./reducers/employeeAddress";
import { unitReducer } from "./reducers/unit";
import { productBrandReducer } from "./reducers/productBrand";
import { barcodeReducer } from "./reducers/barcode";
import { transactionReducer } from "./reducers/transaction";
import { salesReportReducer } from "./reducers/salesReport";
import { creditBalanceReportReducer } from "./reducers/creditBalanceReport";
import { productVariationReducer } from "./reducers/productVariation";
import pushNotificationReducer from "./reducers/pushNotification";
import { userReducer } from "./reducers/user";
import { productVideoReducer } from "./reducers/productVideo";
import { couponReducer } from "./reducers/coupon";
import { productSeoReducer } from "./reducers/productSeo";
import frontendCountryCodeReducer from "./reducers/frontend/frontendCountryCode";
import frontendPageReducer from "./reducers/frontend/frontendPage";
import { frontendSliderReducer } from "./reducers/frontend/frontendSlider";
import frontendProductCategoryReducer from "./reducers/frontend/frontendProductCategory";
import frontendProductReducer from "./reducers/frontend/frontendProduct";
import promotionReducer from "./reducers/promotion";
import promotionProductReducer from "./reducers/promotionProduct";
import productSectionReducer from "./reducers/productSection";
import productSectionProductReducer from "./reducers/productSectionProduct";
import { benefitReducer } from "./reducers/benefit";
import frontendPromotionReducer from "./reducers/frontend/frontendPromotion";
import purchaseReducer from "./reducers/purchase";
import { returnOrderReducer } from "./reducers/returnOrder";
import { returnReasonReducer } from "./reducers/returnReason";
import { damageReducer } from "./reducers/damage";
import frontendBenefitReducer from "./reducers/frontend/frontendBenefit";
import frontendProductSectionReducer from "./reducers/frontend/frontendProductSection";
import { frontendAddressReducer } from "./reducers/frontend/frontendAddress";
import supplierReducer from "./reducers/supplier";
import frontendWishlistReducer from "./reducers/frontend/frontendWishlist";
import frontendProductVariationReducer from "./reducers/frontend/frontendProductVariation";
import { frontendSignupReducer } from "./reducers/frontend/frontendSignup";
import frontendCartReducer from "./reducers/frontend/frontendCart";
import { stockReducer } from "./reducers/stock";
import frontendCouponReducer from "./reducers/frontend/frontendCoupon";
import { shippingSetupReducer } from "./reducers/shippingSetup";
import { orderAreaReducer } from "./reducers/orderArea";
import { notificationAlertReducer } from "./reducers/notificationAlert";
import frontendPaymentGatewayReducer from "./reducers/frontend/frontendPaymentGateway";
import { frontendOrderReducer } from "./reducers/frontend/frontendOrder";
import frontendOrderAreaReducer from "./reducers/frontend/frontendOrderArea";
import { dashboardReducer } from "./reducers/dashboard";
import frontendReturnAndRefundReducer from "./reducers/frontend/frontendReturnAndRefund";
import frontendReturnReasonReducer from "./reducers/frontend/frontendReturnReason";
import { frontendOverviewReducer } from "./reducers/frontend/frontendOverview";
import { frontendProductReviewReducer } from "./reducers/frontend/frontendProductReview";
import { onlineOrderReducer } from "./reducers/onlineOrder";
import productsReportReducer from "./reducers/productsReport";
import { myOrderDetailsReducer } from "./reducers/myOrderDetails";
import { posOrderReducer } from "./reducers/posOrders";
import { posProductVariationReducer } from "./reducers/posProductVariation";
import { posProductCategoryReducer } from "./reducers/posProductCategory";
import { posProductReducer } from "./reducers/posProduct";
import { posCartReducer } from "./reducers/posCart";
import { outletReducer } from "./reducers/outlet";
import frontendProductBrandReducer from "./reducers/frontend/frontendProductBrand";
import { returnAndRefundReducer } from "./reducers/returnAndRefund";
import frontendOutletReducer from "./reducers/frontend/frontendOutlet";
import { subscriberReducer } from "./reducers/subscriber";
import { analyticSectionReducer } from "./reducers/analyticSection";
import paginationReducer from "./reducers/pagination";

const rootReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  countryCode: countryCodeReducer,
  mail: mailReducer,
  otp: otpReducer,
  notification: notificationReducer,
  socialMedia: socialMediaReducer,
  license: licenseReducer,
  cookies: cookiesReducer,
  page: pageReducer,
  analytic: analyticReducer,
  analyticSection: analyticSectionReducer,
  theme: themeReducer,
  slider: sliderReducer,
  currency: currencyReducer,
  site: siteReducer,
  productCategory: productCategoryReducer,
  tax: taxReducer,
  returnReason: returnReasonReducer,
  globalState: globalReducer,
  menuSection: menuSectionReducer,
  menuTemplate: menuTemplateReducer,
  language: languageReducer,
  smsGateway: smsGatewayReducer,
  productAttribute: productAttributeReducer,
  paymentGateway: paymentGatewayReducer,
  timezone: timezoneReducer,
  productAttributeOption: productAttributeOptionReducer,
  role: roleReducer,
  permission: permissionReducer,
  product: productReducer,
  administrator: administratorReducer,
  administratorAddress: administratorAddressReducer,
  customer: customerReducer,
  customerAddress: customerAddressReducer,
  employee: employeeReducer,
  employeeAddress: employeeAddressReducer,
  unit: unitReducer,
  productBrand: productBrandReducer,
  barcode: barcodeReducer,
  transaction: transactionReducer,
  salesReport: salesReportReducer,
  creditBalanceReport: creditBalanceReportReducer,
  productVariation: productVariationReducer,
  pushNotification: pushNotificationReducer,
  user: userReducer,
  productVideo: productVideoReducer,
  productSeo: productSeoReducer,
  promotion: promotionReducer,
  promotionProduct: promotionProductReducer,
  productSection: productSectionReducer,
  productSectionProduct: productSectionProductReducer,
  benefit: benefitReducer,
  purchase: purchaseReducer,
  damage: damageReducer,
  returnOrder: returnOrderReducer,
  supplier: supplierReducer,
  outlet: outletReducer,
  coupon: couponReducer,
  frontendSetting: frontendSettingReducer,
  frontendLanguage: frontendLanguageReducer,
  frontendEditProfile: frontendEditProfileReducer,
  frontendCountryCode: frontendCountryCodeReducer,
  frontendPage: frontendPageReducer,
  frontendSlider: frontendSliderReducer,
  frontendProductCategory: frontendProductCategoryReducer,
  frontendProduct: frontendProductReducer,
  frontendBenefit: frontendBenefitReducer,
  frontendPromotion: frontendPromotionReducer,
  frontendProductSection: frontendProductSectionReducer,
  frontendWishlist: frontendWishlistReducer,
  frontendProductVariation: frontendProductVariationReducer,
  frontendAddress: frontendAddressReducer,
  frontendSignup: frontendSignupReducer,
  frontendCart: frontendCartReducer,
  frontendCoupon: frontendCouponReducer,
  stock: stockReducer,
  shippingSetup: shippingSetupReducer,
  orderArea: orderAreaReducer,
  notificationAlert: notificationAlertReducer,
  frontendPaymentGateway: frontendPaymentGatewayReducer,
  frontendOrder: frontendOrderReducer,
  frontendOrderArea: frontendOrderAreaReducer,
  dashboard: dashboardReducer,
  frontendReturnAndRefund: frontendReturnAndRefundReducer,
  frontendReturnReason: frontendReturnReasonReducer,
  frontendOverview: frontendOverviewReducer,
  onlineOrder: onlineOrderReducer,
  productsReport: productsReportReducer,
  myOrderDetails: myOrderDetailsReducer,
  frontendProductReview: frontendProductReviewReducer,
  posOrder: posOrderReducer,
  posProductVariation: posProductVariationReducer,
  posProductCategory: posProductCategoryReducer,
  posProduct: posProductReducer,
  posCart: posCartReducer,
  returnAndRefund: returnAndRefundReducer,
  frontendProductBrand: frontendProductBrandReducer,
  frontendOutlet: frontendOutletReducer,
  subscriber: subscriberReducer,

  pagination: paginationReducer,
});

export default rootReducer;
