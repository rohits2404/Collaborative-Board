const onlineStatus = async (req, res, next) => {
    try {
        if (req.user) {
            const user = req.user;
            user.isOnline = true;
            user.lastSeen = Date.now();
            await user.save();
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

export default onlineStatus;