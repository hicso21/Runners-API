// import stripe from 'stripe';

// stripe(
// 	'sk_test_51OF3gIKYlUxdQCJckVTWdKqzAtl3eEXpg0QCpQfCwNncKcE7D8RhmAptd5UuwB31NdJzrx3KpaCDHEmuEf7Ob8H100abDfSC9P'
// );
// stripe.products
// 	.create({
// 		name: 'Starter Subscription',
// 		description: '$12/Month subscription',
// 	})
// 	.then((product) => {
// 		stripe.prices
// 			.create({
// 				unit_amount: 1200,
// 				currency: 'usd',
// 				recurring: {
// 					interval: 'month',
// 				},
// 				product: product.id,
// 			})
// 			.then((price) => {
// 				console.log(
// 					'Success! Here is your starter subscription product id: ' +
// 						product.id
// 				);
// 				console.log(
// 					'Success! Here is your starter subscription price id: ' +
// 						price.id
// 				);
// 			});
// 	});
