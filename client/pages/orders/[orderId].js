import {
  useEffect,
  useState,
} from 'react';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();

      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // return will be called when navigating away from component
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if (timeLeft < 0) {
    return (
      <div>Order Expired</div>
    )
  };

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HzNR6Eu9vXb313I7IXgfN8hb2VYPQyfoQGj0v5F9jfnqqmfTvCrDVsFmZTgVOCJGdf72ATPIFkBX4sk5ApPEEgz00DoPO9U0C"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;
