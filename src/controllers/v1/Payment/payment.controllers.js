import braintree from 'braintree';
import config from '../../../config/stripe.js';

// const gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: config.merchantId,
//   publicKey: config.publicKey,
//   privateKey: config.privateKey,
// });

class PaymentControllers {
    // static async getToken(req, res) {
    //   const body = req.body;
    //   try {
    //     gateway.clientToken.generate({}, (err, response) => {
    //       if (err) throw err;
    //       res.send({ clientToken: response.clientToken });
    //     });
    //   } catch (error) {
    //     res.send({
    //       error: true,
    //       data: error,
    //     });
    //   }
    // }

    // static async checkout(req, res) {
    //   try {
    //     const { nonce } = req.body;

    //     // Use the nonce to make a transaction on the server side
    //     gateway.transaction.sale(
    //       {
    //         amount: "10.00",
    //         paymentMethodNonce: nonce,
    //         options: {
    //           submitForSettlement: true,
    //         },
    //       },
    //       (err, result) => {
    //         if (err) throw err;
    //         res.send(result);
    //       }
    //     );
    //   } catch (error) {
    //     res.send({
    //       error: true,
    //       data: error,
    //     });
    //   }
    // }

    static async getTestPublishableKey(req, res) {
        try {
            const pbKey = config.development.publishable_key;
            res.send({ data: pbKey, error: false });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getPublishableKey(req, res) {
        try {
            const pbKey = config.production.publishable_key;
            res.send({ data: pbKey, error: false });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }
}

export default PaymentControllers;
