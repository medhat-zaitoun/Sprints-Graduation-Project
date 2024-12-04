import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id: "AbUuofqOuWLW5uoB_480ehL4WFQb-AfnsRjgeGRmXCINsSweOxWxAWilQcZ9T1y2c_SHGisGQR17YM9z",
  client_secret: "EHKEezeZHJgYmrT1_sFeztdZW-mLIO0D_qZceQMFximJYiACaUeybg2Jpb8jRgs2kJS7n_BnUiGtzacj",
});

export default paypal;
