
export const validateRegister = (req,res, next) => {
    const { username, password } = req.body;
    if (!username  || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    if (password.length < 3) {
        return res.status(400).json({ message: "Password must be at least 3 characters!" });
    }
    next();
}

export const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required!" });
    }
    next();
};