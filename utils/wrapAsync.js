module.exports= (fn) => {  // directly exports our func
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}