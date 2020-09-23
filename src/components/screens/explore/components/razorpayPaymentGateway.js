import RazorpayCheckout from 'react-native-razorpay';
import color from '../../../../assets/styles/color';
import {getData} from '../../../services/AsyncStorage';

export const razorpayPaymentGateway = async (data, requiredDetails) => {
  console.log(requiredDetails);
  var options = {
    key: data.api_key, // Enter the Key ID generated from the Dashboard
    amount: data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    currency: data.order.currency,
    name: requiredDetails.detail.title,
    description: requiredDetails.detail.description,
    image: '',
    order_id: data.order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
    prefill: {
      name: await getData('username'),
      email: await getData('email'),
      contact: '9999999999',
    },
    notes: {
      address: 'note value',
    },
    theme: {
      color: color.primaryBrandColor,
    },
  };
  return RazorpayCheckout.open(options)
    .then((data) => {
      // handle success
      let outputData = {
        options,
        data,
      };
      return outputData;
    })
    .catch((error) => {
      // handle failure
      //   alert(`Error: ${error.code} | ${error.description}`);
    });
};
