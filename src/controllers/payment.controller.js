export const createPaymentOrder = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Payment order route working"
    });
};

export const savePayment = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Save payment route working"
    });
};