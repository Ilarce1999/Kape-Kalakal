import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


export const GetClientId = async (req, res) => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        message: "PayPal Client ID not found in environment variables.",
      });
    }

    // Send clientId as JSON object
    res.json({ clientId });
  } catch (error) {
    console.error("Error fetching PayPal Client ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 

export const createPaypalOrder = async (req, res) => {
  try {
    const auth = await axios({
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
      data: 'grant_type=client_credentials',
    });

    const accessToken = auth.data.access_token;

    const order = await axios({
      url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'PHP',
              value: req.body.total.toFixed(2),
            },
          },
        ],
      },
    });

    res.json({ id: order.data.id });
  } catch (err) {
    console.error('PayPal Order Error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'PayPal order creation failed' });
  }
};
