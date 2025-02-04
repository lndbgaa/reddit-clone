export default (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch((e) => next(e));
    };
};
//# sourceMappingURL=catchAsync.js.map