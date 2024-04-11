require("dotenv").config();
const axios = require("axios")
const uniqid = require('uniqid');


const newOrderId = async (req, res) => {
    try {
        const { name, email, phone } = req.body
        const options = {
            method: 'POST',
            url: 'https://sandbox.cashfree.com/pg/orders',
            headers: {
                accept: 'application/json',
                'x-api-version': '2023-08-01',
                'content-type': 'application/json',
                'x-client-id': process.env.cashfree_app_id,
                'x-client-secret': process.env.cashfree_secret_key
            },
            data: {
                customer_details: {
                    customer_id: uniqid('customer-'),
                    customer_email: email,
                    customer_phone: phone,
                    customer_name: name
                },
                order_id: uniqid('order-'),
                order_amount: 1,
                order_currency: "INR",
                order_note: "Now in Testing Phase"
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                return res.json({ status: "success", message: response.data.payment_session_id })
            })
            .catch((error) => {
                console.log(error);
                return res.json({ status: "error", message: error.message })
            })

    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
}


const checkStatus = async (req, res) => {
    const orderid = req.params.orderid;
    try {
        const options = {
            method: 'GET',
            url: `https://sandbox.cashfree.com/pg/orders/${orderid}`,
            headers: {
                accept: 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.cashfree_app_id,
                'x-client-secret': process.env.cashfree_secret_key
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log("Testing Response Status in GET REQUEST", response.data.order_status);
                if (response.data.order_status == "PAID") {
                    return res.redirect('http://localhost:3000/success')
                } else {
                    let terminateStatus = changeToTerminateStatus(orderid)
                    console.log("terminate status", terminateStatus);
                    if (terminateStatus === "success") {
                        console.log("successfully changed status to terminated");
                        let terminatereason = getTerminateReason(orderid)
                        console.log("Terminate Reason Data", terminatereason);
                        if (terminatereason.stats === "success") {
                            return res.redirect(`http://localhost:3000/reason/:${terminatereason.reason}`)
                        }
                    } else {
                        console.log("unsuccessfully changed status to terminated");
                        return res.redirect('http://localhost:3000/failure')
                    }
                }
            })
    } catch (error) {
        return res.json({ status: "error", message: error.message })
    }
}

const changeToTerminateStatus = async (props) => {
    const options = {
        method: 'PATCH',
        url: `https://sandbox.cashfree.com/pg/orders/${props}`,
        headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'content-type': 'application/json',
            'x-client-id': process.env.cashfree_app_id,
            'x-client-secret': process.env.cashfree_secret_key
        },
        data: {
            order_status: "TERMINATED"
        }
    }

    // axios
    //     .request(options)
    //     .then(function (response) {
    //         console.log("Logging Response When Attempting to Change Status of Order", response);
    //         return "success"
    //     })
    //     .catch((error) => {
    //         console.log("Failed to Change Order Status ", error.message);
    //         return "failure"
    //     })

    const res = await axios.request(options)
    return res.data
}

const getTerminateReason = async (props) => {
    const options = {
        method: 'GET',
        url: `https://sandbox.cashfree.com/pg/orders/${props}/payments`,
        headers: {
            accept: 'application/json',
            'x-api-version': '2023-08-01',
            'x-client-id': process.env.cashfree_app_id,
            'x-client-secret': process.env.cashfree_secret_key
        }
    }
    axios
        .request(options)
        .then(function (response) {
            let data = {
                stats: "success",
                status: response.data.payment_status,
                reason: response.data.error_details.error_description_raw
            }
            return data
        })
}

module.exports = { newOrderId, checkStatus }